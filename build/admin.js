var gulp = require('gulp')
var webpack = require('webpack')
var watch = require('gulp-watch')
var rename = require("gulp-rename")
var minifyCSS = require('gulp-minify-css')
var concat = require('gulp-concat')
var autoprefixer = require('gulp-autoprefixer')
var stylus = require('gulp-stylus')

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

var dist = './dist/admin/'
var src =  './src/admin/'
var img = src + '**/*.{png,jpg,woff,eof,svg,gif}'
var style = src + '**/*.styl'
var js = src + '**/*.js'
var html = src + 'index.html'
var rewrite = function (path) { path.dirname = '' }

gulp.task('admin:js', function (done) {
  var config = {
    entry: src + 'index.js',
    output: {
      path: dist + 'js',
      filename: 'bundle.js',
      devtoolModuleFilenameTemplate: '[resource-path]',
      publicPath: '/js/'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loaders: ['babel?optional=runtime&stage=0']
        }
      ]
    },
    devtool: 'source-map'
  }
  config.module.loaders[0].loaders.unshift('react-hot')
  webpack(config, function () { done() })
})


gulp.task('admin:img', function () {
  return gulp.src(img)
    .pipe(rename(rewrite))
    .pipe(gulp.dest(dist + 'img'))
})

gulp.task('admin:html', function() {
  return gulp.src(html)
    .pipe(rename(rename(rewrite)))
    .pipe(gulp.dest(dist))
})

gulp.task('admin:style', function () {
  return gulp.src(style)
    .pipe(stylus())
    .pipe(autoprefixer(autoprefixerBrowsers))
    .pipe(minifyCSS())
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest(dist + 'css'))
})

gulp.task('admin:watch', function() {
  function start(name) {
    gulp.start(name)
  }
  watch(style, start.bind(this, 'admin:style'))
  watch(img, start.bind(this, 'admin:img'))
  watch(html, start.bind(this, 'admin:html'))
  watch(js, start.bind(this, 'admin:js'))
})

gulp.task('admin', ['admin:js', 'admin:style', 'admin:img', 'admin:html', 'admin:watch'])
