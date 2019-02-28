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

app.listen(port);

console.log('Hex Reviews API server started on port: ' + port);