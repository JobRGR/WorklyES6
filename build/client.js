var gulp = require('gulp')
var watch = require('gulp-watch')
var styleBuild = require('./utils/style')
var scriptBuild = require('./utils/script')
var imageBuild = require('./utils/image')
var htmlBuild = require('./utils/html')

var dist = './dist/client/'
var src =  './src/client/'
var img = src + '**/*.{png,jpg,woff,eof,svg,gif}'
var style = src + '**/*.styl'
var js = src + '**/*.js'
var html = src + 'index.html'

gulp.task('js', scriptBuild.bind(this, src, dist))
gulp.task('img', imageBuild.bind(this, img, dist))
gulp.task('html', htmlBuild.bind(this, html, dist))
gulp.task('style', styleBuild.bind(this, style, dist))

gulp.task('watch', function() {
  function start(name) {
    gulp.start(name)
  }
  watch(style, start.bind(this, 'style'))
  watch(img, start.bind(this, 'img'))
  watch(html, start.bind(this, 'html'))
  watch(js, start.bind(this, 'js'))
})

gulp.task('client', ['js', 'style', 'img', 'html', 'watch'])
