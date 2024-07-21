# antartida-builder

Example:

```javascript
buildAssets({
  watch: true,
  afterBuild: () => {
    // after build js
  },
  js: {
    pathIn: 'src/js',
    pathOut: 'www/assets/js',
    name: 'main',
    watches: ['../common/js']
  },
  scss: {
    pathIn: 'src/scss',
    pathOut: 'www/assets/css',
    name: '1-basic',
    watches: [`src/scss/**/*.scss`]
  },
  absolutePath: __dirname
});
```
