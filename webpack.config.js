const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.resolve('dist/public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { 
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: [/node_modules/]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('client', 'index.html') // Load a custom template (lodash by default see the FAQ for details)
    })
  ]
}