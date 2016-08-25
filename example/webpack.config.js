/* eslint-disable */
var path = require('path');

module.exports = {
  entry: './example/index.js',
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
