const express = require('express');
const cors = require('cors');
const port = 4500;
const mongoose = require('mongoose');
const games = require('./API/Models/HexReviewsAPIModel');
const bodyParser = require('body-parser');
const ejs = require('ejs');


//  Initialising app variable.
const app = express();

//  Setup EJS.
app.set('view engine', 'ejs');

//  Setup static directories.
app.use(express.static(__dirname + '/CSS'));
app.use(express.static(__dirname + '/Logic'));

// Configuring app.
app.use(cors());
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

//  MongoDB configuration.
const mongoURI = 'mongodb://localhost/hex-reviews-database';

//  Mongoose connection details to MongoDB.
const conn = mongoose.createConnection(mongoURI);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/hex-reviews-database');

app.get('/AddGamePage', (req, res) => res.render('HexReviewsAddGamePage.ejs'));
app.get('/ViewGamesPage', (req, res) => res.render('HexReviewsViewGamesPage.ejs'));
app.get('/ViewSingleGamePage', (req, res) => res.render('HexReviewsViewSingleGamePage.ejs'));

var routes = require('./API/Routes/HexReviewsAPIRoutes');
routes(app);

app.listen(port);

console.log('Hex Reviews API server started on port: ' + port);