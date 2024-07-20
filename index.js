const { jsBundle, jsWatch } = require('./lib/task.javascript.js');
const { sassRender, sassWatch } = require('./lib/task.sass.js');
const { copyFonts, watchFonts } = require('./lib/task.assets.fonts.js');
const { copyImages, watchImages } = require('./lib/task.assets.images.js');
const { copyFavicon } = require('./lib/task.assets.favicon.js');

function defaultFn() {
  return true;
}

module.exports = {
  buildAssets: function ({
    js,
    scss,
    fonts,
    images,
    favicon,
    absolutePath,
    watch = true,
    afterBuild = defaultFn
  }) {
    if (scss) {
      sassRender(scss)({
        fnWatch: () => watch && sassWatch(scss)()
      });
    }
    if (js) {
      jsBundle(
        js,
        absolutePath,
        afterBuild
      )({
        fnWatch: () => watch && jsWatch(js, absolutePath, afterBuild)()
      });
    }
    if (fonts) {
      copyFonts(
        fonts,
        absolutePath
      )({
        fnWatch: () => watch && watchFonts(fonts, absolutePath)()
      });
    }
    if (images) {
      copyImages(
        images,
        absolutePath
      )({
        fnWatch: () => watch && watchImages(images, absolutePath)()
      });
    }
    if (favicon) {
      copyFavicon(favicon, absolutePath)();
    }
  }
};
