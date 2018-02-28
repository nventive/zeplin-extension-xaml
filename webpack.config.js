const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(`${__dirname}/dist`),
    filename: 'main.js',
    libraryExport: 'default',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.mustache$/,
        loader: 'mustache-loader',
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/manifest.json' },
    ]),
  ],
};
