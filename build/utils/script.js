var webpack = require('webpack')

module.exports = function (src, dist, done) {
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
}