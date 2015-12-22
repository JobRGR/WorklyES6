var gulp = require('gulp')
var sh = require('shelljs')
var nodemon = './node_modules/.bin/nodemon --watch '
var babelNode = './node_modules/.bin/babel-node '
var inspector = './node_modules/.bin/node-inspector --web-port=8084'
var server = './src/server '

function next (done) {
  done()
}

gulp.task('server', function (done) {
  sh.exec(babelNode + server, next.bind(this, done))
})

gulp.task('debug', function(done) {
  sh.exec(babelNode + '--debug --stage 0 -- ' + server + ' --debug', next.bind(this, done))
})

gulp.task('inspector', function(done) {
  sh.exec('bash ' + nodemon + server + inspector, next.bind(this, done))
})
