const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: {
      main: './js/modern.js',
      mobileMenu: './js/mobile-menu.js'
    },
    output: {
      filename: isProduction ? '[name].[contenthash].bundle.js' : '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
        publicPath: '/',
        watch: true,
      },
      compress: true,
      port: 3000,
      hot: true,
      open: true,
      historyApiFallback: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]',
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        chunks: ['main'],
      }),
      isProduction && new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
      }),
    ].filter(Boolean),
    resolve: {
      extensions: ['.js', '.json'],
    },
    optimization: isProduction ? {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            ecma: 2020,
            compress: true,
            output: {
              comments: false,
            },
          },
        }),
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    } : {},
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  };
};
