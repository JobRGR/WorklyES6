var gulp = require('gulp')
var webpack = require('webpack')
var del = require('del')
var sh = require('shelljs')

var watch = require('gulp-watch')

var rename = require("gulp-rename")

var minifyCSS = require('gulp-minify-css')
var concat = require('gulp-concat')
var autoprefixer = require('gulp-autoprefixer')
var stylus = require('gulp-stylus')

var nodemon = './node_modules/.bin/nodemon --watch '
var babelNode = './node_modules/.bin/babel-node '
var inspector = './node_modules/.bin/node-inspector --web-port=8084'
var server = './src/server'

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

var searchImgClient = './src/client/**/*.{png,jpg,woff,eof,svg,gif}'
var searchImgServer = './src/server/**/*.{png,jpg,woff,eof,svg,gif}'
var html = './src/client/index.html'

gulp.task('client', function (done) {
  var config = require('./webpack.client.js')
  webpack(config, function () { done() })
})


gulp.task('img:client', function () {
  gulp.src(searchImgClient)
    .pipe(rename(function (path) { path.dirname = '' }))
    .pipe(gulp.dest('./dist/img/'))
})

gulp.task('html', function() {
  return gulp.src(html)
    .pipe(rename(function (path) { path.dirname = '' }))
    .pipe(gulp.dest('./dist'))
})


gulp.task('img:server', function () {
  gulp.src(searchImgServer)
    .pipe(rename(function (path) {
      path.dirname = ''
    }))
    .pipe(gulp.dest('./dist/img_server'))
})

gulp.task('img', ['img:client', 'img:server'])

gulp.task('style', function () {
  return gulp.src('./src/**/*.styl')
    .pipe(stylus())
    .pipe(autoprefixer(autoprefixerBrowsers))
    .pipe(minifyCSS())
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('./dist/css/'))
})

gulp.task('server', function (done) {
  sh.exec(nodemon + server + ' ' + babelNode  + server, function() { done() })
})

gulp.task('server:debug', function(done) {
  sh.exec(nodemon + server + ' ' + babelNode + '--debug --stage 0 -- ' + server +' --debug', function() { done() })
})

gulp.task('inspector', function(done) {
  sh.exec(nodemon + server + ' ' + inspector,
    function() { done() })
})

gulp.task('watch', function() {
  watch('./src/**/*.styl', function () {
    gulp.start('style')
  })
  watch(searchImgClient, function () {
    gulp.start('img:client')
  })
  watch(searchImgServer, function () {
    gulp.start('img:server')
  })
  watch(html, function () {
    gulp.start('html')
  })
  gulp.watch('./src/client/**/*.js', ['client'])
})

gulp.task('clean', function(cb) {
  del(['dist/'], cb)
})

gulp.task('build', ['clean'], function() {
  gulp.start(['html', 'client', 'style', 'img'])
})
gulp.task('debug', ['build', 'server:debug', 'inspector', 'watch'])
gulp.task('default', ['build', 'server', 'watch'])

