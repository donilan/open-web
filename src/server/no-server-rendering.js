var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = process.env.NODE_ENV === 'production' ? require('./webpack.config.production') : require('../../webpack.config');
var port = process.env.PORT || 3000;

var app = express();
var compiler = webpack(config);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res) {
  res.render('index', { html: null, reduxState: JSON.stringify({}), scriptSrcs: []});
});

app.listen(port, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost: ' + port);
});
