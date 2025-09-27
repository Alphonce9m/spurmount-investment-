const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
const path = require('path');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/',
      serveIndex: true,
      watch: {
        ignored: /node_modules/,
      },
    },
    compress: true,
    port: 3000,
    hot: true,
    liveReload: true,
    historyApiFallback: {
      index: 'test.html',
    },
    open: ['/test.html'],
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true,
      logging: 'info',
    },
    devMiddleware: {
      writeToDisk: true,
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  stats: {
    errorDetails: true,
  },
});
