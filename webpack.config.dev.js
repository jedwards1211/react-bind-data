var path = require('path');
var merge = require('webpack-merge');
var webpack = require('webpack');

module.exports = merge(
  {
    entry: [
      'webpack-dev-server/client?http://0.0.0.0:8080',
      'webpack/hot/only-dev-server'
    ],
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ],
    output: {
      path: path.join(__dirname, 'sandbox'),
      publicPath: '/',
      filename: 'sandbox.bundle.js'
    },
    devServer: {
      publicPath: '/',
      host: '0.0.0.0',
      hot: true,
      historyApiFallback: true,
      port: 8080,
      stats: {
        colors: true,
        chunkModules: false,
        modules: false
      }
    }
  }, 
  require('./webpack.config'), 
  {
    devtool: 'eval',
    entry: [
      path.join(__dirname, 'sandbox')
    ]
  }
);
