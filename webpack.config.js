var path = require('path');
var webpack = require('webpack');
var _ = require('lodash');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var plugins = [
  new ExtractTextPlugin("app.css"),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }),
];

var webpackConfig = {
  devtool: false,
  output: {
    path: path.join(__dirname, 'www'),
    filename: 'app.js',
    publicPath: '/static/'
  },
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
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass')
      }
    ]
  }
};

if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
  webpackConfig = _.extend(webpackConfig, {
    entry : [
      './src/client/index.js'
    ],
    plugins : plugins
  });
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  webpackConfig = _.extend(webpackConfig, {
    devtool: 'eval',
    entry : [
      './src/client/index.js',
      'webpack-hot-middleware/client',
    ],
    plugins: plugins
  });
  webpackConfig.module.loaders[0]['query'] = {
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

module.exports = webpackConfig;
