var gulp = require('gulp')
var watch = require('gulp-watch')
var styleBuild = require('./utils/style')
var scriptBuild = require('./utils/script')
var imageBuild = require('./utils/image')
var htmlBuild = require('./utils/html')

var dist = './dist/admin/'
var src =  './src/admin/'
var img = src + '**/*.{png,jpg,woff,eof,svg,gif}'
var style = src + '**/*.{styl,css}'
var js = src + '**/*.js'
var html = src + 'index.html'
var clientApi = './src/client_api'

gulp.task('admin:js', scriptBuild.bind(this, src, dist))
gulp.task('admin:img', imageBuild.bind(this, img, dist))
gulp.task('admin:html', htmlBuild.bind(this, html, dist))
gulp.task('admin:style', styleBuild.bind(this, style, dist))

gulp.task('admin:watch', function() {
  function start(name) {
    gulp.start(name)
  }
  watch(style, start.bind(this, 'admin:style'))
  watch(img, start.bind(this, 'admin:img'))
  watch(html, start.bind(this, 'admin:html'))
  watch(js, start.bind(this, 'admin:js'))
  watch(clientApi, start.bind(this, 'admin:js'))
})

gulp.task('admin', ['admin:js', 'admin:style', 'admin:img', 'admin:html'])
