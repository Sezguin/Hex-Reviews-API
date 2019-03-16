'use strict';

var mongoose = require('mongoose');
var fs = require('fs');
var Games = mongoose.model('Games');
var GameImages = mongoose.model('GameImages');

var imgPath = __dirname + '/log.png';

//  List all games in the database.
exports.list_all_games = function(req, res) {
    Games.find({}, function(err, game) {
        if (err)
            res.send(err);
        res.json(game);
    });
};

exports.create_an_image = function(req, res) {

    console.log("A new game image is being created...");

    var new_game_image = new GameImages(req.body);

    console.log("Game image body: " + new_game_image);
}

//  Create a new game in the database.
exports.create_a_game = function(req, res) {

    console.log("A new game is being created...");
    
    var new_game = new Games(req.body);
    console.log("--------------------" + JSON.stringify(req.body));
    // var new_game_image = new GameImages(req.body);

    new_game.game_image = fs.readFileSync(imgPath).toString('base64');

    new_game.save(function(err, game) {
        if (err)
            res.send(err);
        res.json(game);
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