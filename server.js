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
app.use('/Images', express.static(__dirname + "/Images"));

// Configuring app.
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

//  MongoDB configuration.
const mongoURI = 'mongodb+srv://SamPepper:moistman@hexdatabase-cejgb.mongodb.net/hex-reviews-database?retryWrites=true';

//  Mongoose connection details to MongoDB.
const conn = mongoose.createConnection(mongoURI);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://SamPepper:moistman@hexdatabase-cejgb.mongodb.net/hex-reviews-database?retryWrites=true');

//  Login and account creation.
app.get('/', (req, res) => res.render("HexReviewsTitlePage.ejs"));
app.get('/LoginPage', (req, res) => res.render('HexReviewsLoginPage.ejs'));
app.get('/CreateAccountPage', (req, res) => res.render('HexReviewsCreateAccountPage.ejs'));

//  User pages.
app.get('/UserHomePage', (req, res) => res.render("HexReviewsUserHomePage.ejs"));
app.get('/UserReviewPage', (req, res) => res.render("HexReviewsUserReviewPage.ejs"));
app.get('/AddReviewPage', (req, res) => res.render("HexReviewsAddReviewPage.ejs"));
app.get('/UserViewGamesPage', (req, res) => res.render("HexReviewsUserViewGamesPage.ejs"));
app.get('/UserViewSingleGamePage', (req, res) => res.render("HexReviewsUserViewSingleGamePage.ejs"));
app.get('/UserSubscriptionsPage', (req, res) => res.render("HexReviewsUserSubscriptionsPage.ejs"));
app.get('/ViewOtherProfilePage', (req, res) => res.render("HexReviewsViewOtherUserProfilePage.ejs"));
app.get('/ViewUserProfilePage', (req, res) => res.render("HexReviewsViewUserProfilePage.ejs"));
app.get('/UserEditProfilePage', (req, res) => res.render("HexReviewsEditUserProfilePage.ejs"));
app.get('/UserGameRequestPage', (req, res) => res.render("HexReviewsUserGameRequestPage.ejs"));

//  Review pages.
app.get('/ViewGameReviewsPage', (req, res) => res.render("HexReviewsViewGameReviews.ejs"));
app.get('/ViewSingleReviewPage', (req, res) => res.render("HexReviewsViewSingleReviewPage.ejs"));
app.get('/ViewOtherUserReviewsPage', (req, res) => res.render("HexReviewsViewOtherUserReviewsPage.ejs"));
app.get('/UserViewReviewsPage', (req, res) => res.render("HexReviewsUserViewReviewsPage.ejs"));

//  Admin Pages.
app.get('/AdminHomePage', (req, res) => res.render('HexReviewsAdminHomePage.ejs'));
app.get('/AddGamePage', (req, res) => res.render('HexReviewsAddGamePage.ejs'));
app.get('/ViewGamesPage', (req, res) => res.render('HexReviewsViewGamesPage.ejs'));
app.get('/AdminRequestPage', (req, res) => res.render('HexReviewsAdminRequestPage.ejs'));
app.get('/AdminControlPage', (req, res) => res.render('HexReviewsAdminControlPage.ejs'));

var routes = require('./API/Routes/HexReviewsAPIRoutes');
routes(app);

app.listen(process.env.PORT || port);

console.log('Hex Reviews API server started on port: ' + port);