const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');

module.exports = {
  entry: {
    // index: './src/index.ts'
    index: './src/carousel-page.ts'
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   title: 'TypeScript',
    //   template: resolve(__dirname, '../src/index.html')
    // })
  ]
};
