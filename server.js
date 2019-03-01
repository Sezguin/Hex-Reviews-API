var express = require('express'),
  app = express(),
  port = 4500,
  mongoose = require('mongoose'),
  Games = require('./API/Models/HexReviewsAPIModel'),
  bodyParser = require('body-parser');

//  Mongoose connection details to MongoDB.
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/hex-reviews-database')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./API/Routes/HexReviewsAPIRoutes');
routes(app);

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4600/AddGamePage');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

app.listen(port);

console.log('Hex Reviews API server started on port: ' + port);