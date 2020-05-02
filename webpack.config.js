const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  devtool: 'source-map',
  mode: 'production',
  node: false,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
        options: {
          // silent: true,
          useTranspileModule: true,
          transpileOnly: true,
        }
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
          compress: false,
          mangle: false,
          output: {
            beautify: true
          }
        }
      }),
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  stats: {
    all: false,
    timings: true,
    chunks: true,
    chunkModules: false,
    performance: true,
    warnings: true,
    errors: true,
  }
};
