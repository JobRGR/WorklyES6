require('./build/client.js')
require('./build/admin.js')
require('./build/server.js')

var gulp = require('gulp')
var del = require('del')

gulp.task('clean', function(cb) { del(['dist/'], cb) })
gulp.task('build', ['clean'], function () {
  gulp.start(['client', 'admin'])
})
gulp.task('dev', ['build', 'debug', 'inspector'])
gulp.task('prod', ['build', 'server:prod', 'admin:watch', 'watch'])
gulp.task('default', ['build', 'server', 'admin:watch', 'watch'])
