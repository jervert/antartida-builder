const { copyAssets } = require('./task.assets.js');

function copyFonts({ pathIn, pathOut }, absolutePath) {
  return function ({ fnWatch }) {
    copyAssets(
      {
        pathIn,
        pathOut,
        type: 'font',
        files: '**/*.{woff,woff2,ttf,eot}'
      },
      absolutePath
    );
    if (typeof fnWatch === 'function') {
      fnWatch();
    }
  };
}

function watchFonts() {
  return () => {};
}

module.exports = {
  copyFonts,
  watchFonts
};
