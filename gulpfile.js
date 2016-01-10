require('./build/client.js')
require('./build/admin.js')
require('./build/server.js')

var gulp = require('gulp')
var del = require('del')

gulp.task('clean', function(cb) { del(['dist/'], cb) })
gulp.task('build', ['clean'], function () {
  gulp.start(['js', 'style', 'img', 'html', 'admin:js', 'admin:style', 'admin:img', 'admin:html'])
})
gulp.task('dev', ['build', 'debug', 'inspector'])
gulp.task('default', ['build', 'server'])
