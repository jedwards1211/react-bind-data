var path = require('path')
var ProgressBarPlugin = require('progress-bar-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  entry: [
    'babel-polyfill'
  ],
  resolve: {
    extensions: ['', '.js', '.json']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: path.resolve(__dirname, 'node_modules')
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  plugins: [
    new ProgressBarPlugin()
  ]
}
