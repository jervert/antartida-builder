const { glob } = require('glob');
const { copyFileSync } = require('fs');
const path = require('path');
const log = require('fancy-log');

const makeDir = (...args) =>
  import('make-dir').then(({ default: makeDirectory }) => makeDirectory(...args));

function copyAssets({ pathIn, pathOut, files, type }, absolutePath) {
  const globPath = path
    .normalize(`${absolutePath}/${pathIn}/${files}`)
    .split(path.sep)
    .join('/');
  const absolutePathOut = `${absolutePath}/${pathOut}`;
  glob(globPath, {}, (error, files) => {
    if (error) {
      console.log(error);
    }
    makeDir(path.normalize(absolutePathOut)).then(() => {
      files.forEach(fileIn => {
        const fileOut = fileIn.replace(pathIn, pathOut);
        const fileInLog = fileIn.replace(absolutePath, '');
        const fileOutLog = fileOut.replace(absolutePath, '');
        copyFileSync(fileIn, fileOut);
        log(`Copy ${type} asset: ${fileInLog} ---> ${fileOutLog}`);
      });
    });
  });
}

module.exports = {
  copyAssets
};
