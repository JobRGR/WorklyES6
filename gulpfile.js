var gulp = require('gulp')
var del = require('del')

require('./build/client.js')
require('./build/server.js')


gulp.task('clean', function(cb) { del(['dist/client/'], cb) })

gulp.task('build', ['clean'], function() {
  gulp.start(['client'])
})

gulp.task('dev', ['build', 'debug', 'inspector'])
gulp.task('default', ['build', 'server'])

