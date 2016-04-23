var merge = require('webpack-merge');
var webpack = require('webpack');

module.exports = merge(
  require('./webpack.config'),
  {
    devtool: 'inline-source-map',
    externals: {
      cheerio: 'window',
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': true
    },
    devServer: {
      stats: {
        colors: true,
        chunkModules: false,
        modules: false
      }
    }
  }
);
