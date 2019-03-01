'use strict';

var mongoose = require('mongoose'),
    Games = mongoose.model('Games');

//  List all games in the database.
exports.list_all_games = function(req, res) {
    Games.find({}, function(err, game) {
        if (err)
            res.send(err);
        res.json(game);
    });
};

//  Create a new game in the database.
exports.create_a_game = function(req, res) {
    var new_game = new Games(req.body);

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
    Games.deleteOne({
        _id: req.params.gameID        
    }, function(err, game) {
        if (err)
            res.send(err);
        res.json({ message: 'Game was successfully deleted.'});
    });
};