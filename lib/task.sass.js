const sass = require('sass');
const { writeFile } = require('fs');
const chokidar = require('chokidar');
const log = require('fancy-log');

function sassRender({ name, pathIn, pathOut }) {
  return function ({ fnWatch }) {
    const sourceMap = `${pathOut}/${name}.css.map`;
    const outFile = `${pathOut}/${name}.css`;
    const file = `${pathIn}/${name}.scss`;

    log(`SCSS render -> ${file}`);
    sass.render(
      {
        file,
        sourceMap,
        outFile,
        outputStyle: 'compressed'
      },
      function (errorScss, result) {
        if (errorScss) {
          log.error(`Error in ${file}`);
          console.log(errorScss);
          if (typeof fnWatch === 'function') {
            fnWatch();
          }
        } else {
          writeFile(sourceMap, result.map, {}, function (errorMap) {
            if (!errorMap) {
              log(sourceMap);
              writeFile(outFile, result.css, {}, function (errorCss) {
                if (!errorCss) {
                  log(`${outFile} in ${result.stats.duration}ms`);
                  if (typeof fnWatch === 'function') {
                    fnWatch();
                  }
                }
              });
            }
          });
        }
      }
    );
  };
}

function sassWatch({ name, pathIn, pathOut, watches = [] }) {
  const watchList = [`${pathIn}/style.scss`, `${pathIn}/scss/**/*.scss`].concat(
    watches
  );
  return function () {
    const watcher = chokidar.watch(watchList, {
      persistent: true
    });

    watcher.on('change', path => {
      log(`File ${path} has been changed`);
      sassRender({ name, pathIn, pathOut })({});
    });
  };
}

module.exports = {
  sassRender,
  sassWatch
};
