import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import config, { plugins } from './webpack.config.babel'

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

export const minifyPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  })
]

export default {
  ...config,
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    './src/demo/index'
  ],
  plugins: [
    ...plugins,
    ...minifyPlugins,
    new ExtractTextPlugin({ filename: 'app.css' })
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          sourceMap: true,
          compress: {},
        }
      }),
    ],
  }
}
