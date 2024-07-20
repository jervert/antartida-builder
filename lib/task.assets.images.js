const { copyAssets } = require('./task.assets.js');

function copyImages({ pathIn, pathOut }, absolutePath) {
  return function ({ fnWatch }) {
    copyAssets(
      {
        pathIn,
        pathOut,
        type: 'image',
        files: '**/*.{jpg,jpeg,png,svg}'
      },
      absolutePath
    );
    if (typeof fnWatch === 'function') {
      fnWatch();
    }
  };
}

function watchImages() {
  return () => {};
}

module.exports = {
  copyImages,
  watchImages
};
