/* eslint-disable */
var path = require('path');

module.exports = {
  entry: './playground/index.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
    {
        loader: 'babel'
      }
    ]
  }
};
