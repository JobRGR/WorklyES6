var gulp = require('gulp')
var autoprefixer = require('gulp-autoprefixer')
var stylus = require('gulp-stylus')
var minifyCSS = require('gulp-minify-css')
var concat = require('gulp-concat')

var autoprefixerBrowsers = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 6',
  'opera >= 23',
  'ios >= 6',
  'android >= 4.4',
  'bb >= 10'
]

module.exports = function (src, dist) {
  return gulp.src(src)
    .pipe(stylus())
    .pipe(autoprefixer(autoprefixerBrowsers))
    .pipe(minifyCSS())
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest(dist + 'css'))
}