const webpack = require('webpack');
const log = require('fancy-log');
const path = require('path');
const chokidar = require('chokidar');

function jsWatch(
  { name, pathIn, pathOut, watches = [] },
  absolutePath,
  afterBuild
) {
  return function () {
    const watcher = chokidar.watch(
      [`${pathIn}/**/*.{js,ts,json}`].concat(watches),
      {
        persistent: true,
        awaitWriteFinish: {
          stabilityThreshold: 2000,
          pollInterval: 100
        }
      }
    );

    watcher.on('change', path => {
      log(`File ${path} has been changed`);
      jsBundle({ name, pathIn, pathOut }, absolutePath, afterBuild)({});
    });
  };
}

function jsBundle({ pathIn, pathOut, name }, absolutePath, afterBuild) {
  return function ({ fnWatch }) {
    log(`JS bundle -> ${pathIn}/${name}.js`);
    webpack(
      {
        mode: 'production',
        devtool: 'source-map',
        entry: path.resolve(absolutePath, `${pathIn}/${name}.js`),
        output: {
          filename: `./[name].js`,
          path: path.resolve(absolutePath, pathOut)
        },
        module: {
          rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' },
            {
              test: /\.s[ac]ss$/i,
              use: [
                'style-loader',
                'css-loader',
                {
                  loader: 'sass-loader',
                  options: {
                    implementation: require('sass'),
                    sourceMap: false,
                    sassOptions: {
                      outputStyle: 'compressed',
                      sourceMapContents: false,
                      sourceMapEmbed: false
                    }
                  }
                }
              ]
            }
          ]
        }
      },
      (err, stats) => {
        if (err) {
          console.log(err);
        } else {
          if (stats.hasWarnings()) {
            console.warn(stats.toJson().warnings);
          }
          if (stats.hasErrors()) {
            console.error(stats.toJson().errors);
          } else {
            log(`Finish JS bundle ${pathIn}/${name}.js`);
          }
          if (typeof fnWatch === 'function') {
            fnWatch();
          }
        }
      }
    );
    afterBuild();
  };
}

module.exports = {
  jsBundle,
  jsWatch
};
