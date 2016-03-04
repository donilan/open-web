var path = require('path');
var webpack = require('webpack');
var _ = require('lodash');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
  devtool: null,
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new ExtractTextPlugin("app.css"),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_SERVER: JSON.stringify(process.env.API_SERVER),
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|ttf|eot|svg|woff2|woff)$/,
        loader: 'url?limit=25000'
      }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass')
      }
    ]
  }
};

if(process.env.NODE_ENV === 'production') {
  config.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
} else {
  config = _.extend(config, {
    devtool: 'eval-source-map',
    entry: [
      'webpack-hot-middleware/client',
      './src/index'
    ],
  });
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.module.loaders[0]['query'] = {
    plugins: [
      ["react-transform", {
        transforms: [{
          transform: "react-transform-hmr",
          imports: ["react"],
          locals: ["module"]
        }, {
          "transform": "react-transform-catch-errors",
          "imports": ["react", "redbox-react"]
        }]
      }]
    ]
  };
}

module.exports = config;
