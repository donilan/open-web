var path = require('path');
var webpack = require('webpack');
var _ = require('lodash');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var plugins = [
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
    path: path.join(__dirname, 'dist'),
    filename: 'app.js',
    publicPath: '/dist/'
  }
};

if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
  plugins.push(new ExtractTextPlugin("app.css"));
  webpackConfig.module = {
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
  };
  webpackConfig = _.extend(webpackConfig, {
    entry : [
      './src/client/index.js'
    ],
    plugins : plugins
  });
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  webpackConfig.module = {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
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
        }
      },
      {
        test: /\.(png|jpg|ttf|eot|svg|woff2|woff)$/,
        loader: 'url?limit=25000'
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      }
    ]
  };
  webpackConfig = _.extend(webpackConfig, {
    devtool: 'eval',
    entry : [
      './src/client/index.js',
      'webpack-hot-middleware/client',
    ],
    plugins: plugins
  });
}

module.exports = webpackConfig;
