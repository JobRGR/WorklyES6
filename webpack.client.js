var webpack = require('webpack')

var buildDefinition = {
  entry: './src/client/index.js',
  output: {
    path: './dist/client/js',
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

buildDefinition.module.loaders[0].loaders.unshift('react-hot')
module.exports = buildDefinition