const { copyAssets } = require('./task.assets.js');

function copyFavicon({ pathIn, pathOut }, absolutePath) {
  return function () {
    copyAssets(
      {
        pathIn,
        pathOut,
        type: 'favicon',
        files: '**/*.{ico,png}'
      },
      absolutePath
      );
  };
}

module.exports = {
  copyFavicon
};
