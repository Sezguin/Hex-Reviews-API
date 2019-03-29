'use strict';

var mongoose = require('mongoose');
var fs = require('fs');

var Games = mongoose.model('Games');
var GameImages = mongoose.model('GameImages');
var Users = mongoose.model('Users');

    /*****  All game related functionality  *****/

//  List all games in the database.
exports.list_all_games = function(req, res) {
    Games.find({}, function(err, game) {
        if (err)
            res.send(err);
        res.json(game);
    });
};

//  Create a new image in the database.
exports.create_an_image = function(req, res) {

    console.log("A new game image is being created...");

    var new_game_image = new GameImages(req.body);

    console.log("Creating image for: " + new_game_image.game_title);

    new_game_image.save(function(err, game_image) {
        if(err)
            res.send(err);
        res.json(game_image._id);
    });
};

exports.get_an_image = function(req, res) {
    console.log("An image is being listed...");

    GameImages.findById(req.params.imageID, function(err, game_image) {
        if (err)
            res.send(err);
        res.json(game_image);
    });
};

//  Create a new game in the database.
exports.create_a_game = function(req, res) {

    console.log("A new game is being created...");
    
    var new_game = new Games(req.body);
    
    new_game.save(function(err, game) {
        if(err) {
            res.send("failure");
            console.log("There was an error creating the new game.");
        } else {
            res.send("success");
            console.log("A new game has been created successfully.");
        }       
    });
};

//  List a single game from the database, by using supplied ID.
exports.list_a_game = function(req, res) {
    Games.findById(req.params.gameID, function(err, game) {
        if (err)
            res.send(err);
        res.json(game);
    });
};

//  Update a game in the database.
exports.update_a_game = function(req, res) {
    Games.findOneAndUpdate({_id: req.params.gameID}, req.body, {new: true}, function(err, game) {
        if (err)
            res.send(err);
        res.json(game);
    });
};

//  Delete a game from the database.
exports.delete_a_game = function(req, res) {
    
    console.log("A game is being deleted...");

    Games.deleteOne({
        _id: req.params.gameID        
    }, function(err, game) {
        if (err)
            res.send(err);
        res.json({ message: 'Game was successfully deleted.'});
    });
};



/*****  All user related functionality. *****/

//  Create a user in the database.
exports.create_a_user = function(req, res) {

    console.log("A user is being created...");

    var new_user = new Users(req.body);

    new_user.save(function(err, user) {
        if(err) {
            res.send("failure");
            console.log("There was an error when creating a user in the database.");
            console.log("Error: " + err);
        } else {
            res.send("success");
            console.log("The new user ahas been created successfully.");
        }
    });
}