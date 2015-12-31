var gulp = require('gulp')
var rename = require('gulp-rename')
var rewrite = require('./rewrite')

module.exports = function(src, dist) {
  return gulp.src(src)
    .pipe(rename(rewrite))
    .pipe(gulp.dest(dist))
}