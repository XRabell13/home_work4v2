const {src, dest, parallel, series, watch} = require('gulp');
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');//delete comments, tabs...
const del = require('del');
const image = require('gulp-image');//image squaze
const sass = require('gulp-sass')(require('sass'));//css in scss compiller

function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'build'
    }
  })
}

function html() {
  return src('src/index.html')
    .pipe(dest('build'))// труба, пропуск через что-то, тут через ф-ю dest
    .pipe(browserSync.stream())
}

function css() {
  return src('src/assets/styles/styles.scss')//главный файл со стилями
    .pipe(sass().on('error', sass.logError))//переделывает функция scss в css
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions'],//переписать для последних 2 версий браузерво
      grid: 'autoplace',
    }))
    .pipe(cleanCSS())//удалене коментов, пробелов и тд
    .pipe(dest('build/assets/styles'))
    .pipe(browserSync.stream())
}

function images() {
  return src('src/assets/images/**/*')//в папке картинок берем все папки всех вложенносей и берем все файлы оттуда и пропускаем черзе плагин, чтобы оно сжалось
    .pipe(image())
    .pipe(dest('build/assets/images'))
    .pipe(browserSync.stream())
}

function fonts() {
  return src('src/assets/fonts/**/*')
    .pipe(dest('build/assets/fonts'))
}

function clear() {//удаление папки билд
  return del('build', {force: true});
}


function startWatch() {
  watch('src/*.html', html)
  watch('src/assets/styles/**/*.scss', css)
  watch('src/assets/images/**/*', images)
}

exports.dev = parallel(browsersync, startWatch)
exports.build = series(clear, parallel(html, css, images, fonts))


exports.default = parallel(browsersync, startWatch)
