const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.resolve('dist/public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{ 
      test: /\.jsx?$/,
      use: ['babel-loader'],
      exclude: [/node_modules/]
    }, {
      test: /\.s[ac]ss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true,
            minimize: true
          }
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true
          }
        }]
      })
    }, {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        'file-loader'
      ]
    },
    {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader?mimetype=image/svg+xml'},
    {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/font-woff"},
    {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/font-woff"},
    {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/octet-stream"},
    {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"}]
  },
  devtool: 'eval-source-map', 
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new HtmlWebpackPlugin({
      template: path.resolve('client', 'index.html') // Load a custom template (lodash by default see the FAQ for details)
    })
  ]
}