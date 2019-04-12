'use strict';

var mongoose = require('mongoose');
var fs = require('fs');

var Games = mongoose.model('Games');
var GameImages = mongoose.model('GameImages');
var Users = mongoose.model('Users');
var Reviews = mongoose.model('Reviews');



/*****  All game related functionality  *****/

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

//  Get games from a search.
exports.list_games_from_search = function(req, res) {

    console.log("Searching for specific games containing " + req.params.query + "...");

    Games.find({$text: {$search: req.params.query}}, function(err, games) {
        if(err) {
            console.log("There was an error when retrieving the games.");
            console.log("Error: " + err);
        } else {
            res.send(games);
        }
    });
}



/*****  All image related functionality.    *****/

//  Get a user's avatar.
exports.get_an_avatar = function(req, res) {

    console.log("Fetching user avatar...");

    Users.find({user_username: req.params.userID}, function(err, user) {
        if(user.length) {
            console.log("Sending avatar data...");
            res.send(user[0].user_avatar);
        } else {
            console.log("Unexpected error when retrieving avatar from the database...");
            console.log("Perhaps the user has been deleted?");
        }
    });
}

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
            console.log("The new user has been created successfully.");
        }
    });
}

//  Check a username exists in the database.
exports.check_a_username = function(req, res) {

    console.log("Checking if " + req.params.username + " exists...");

    Users.find({user_username: req.params.username}, function(err, user) {
        if(user.length) {
            res.send(true);
            console.log("User exists in the database.");
        } else {
            res.send(false);
            console.log("There was an error when retrieving " + req.params.username + " from the database.");
            console.log("Error: " + err);
        }
    });
}

//  Retrieve user's ID from the database.
exports.get_user_id = function(req, res) {

    console.log("Retrieving ID of user " + req.params.username + "...");

    Users.find({user_username: req.params.username}, function(err, user) {
        if(user.length) {
            console.log("Sending user ID...");
            res.send(user[0]._id);
        } else {
            res.send("failure");
            console.log("There was an error when retrieving " + req.params.username + " from the database.");
            console.log("Error: " + err);
            res.send(false);
        }
    });
}

//  Retrieve user from database from provided ID.
exports.get_a_user = function(req, res) {

    console.log("Retrieving username for user");

    Users.find({_id: req.params.userID}, function(err, user) {
        if(user.length) {
            console.log("Sending user ID...");
            res.send(user[0]);
        } else {
            res.send("failure");
            console.log("There was an error when retrieving " + req.params.userID + " from the database.");
            console.log("Error: " + err);
            res.send(false);
        }
    });
}

//  Check that the submitted password is correct.
exports.check_user_password = function(req, res) {

    console.log("Checking password for " + req.body.user_username + "...");

    Users.find({user_username: req.body.user_username}, function(err, user) {
        if(user.length) {
            if(req.body.user_password === user[0].user_password) {
                console.log("Password was correct.");
                res.send(true);
            } else {
                console.log("Password was incorrect.")
                res.send(false);
            }
        } else {
            console.log("An unexpected error has occured.");
            console.log("Error: " + err);
            res.send("err");
        }
    });
}

//  Subscribe to a user.
exports.subscribe_to_user = function (req, res) {

    console.log("Subscribing " + req.body.subscriber + " to " + req.body.subscribee + "...");

    var subscriber = req.body.subscriber;
    var subscribee = req.body.subscribee;

    //  Update subcriber's subscription list.
    Users.findOneAndUpdate(
        { _id: subscriber },
        { $push: { user_subscribed_to: subscribee } }, function(err, data) {
            if(data) {
                console.log("Success.");
                res.send("success");
            } else {
                console.log("Error: " + err);
                res.send("failure");
            }
        }
    );
}

//  Unsubscribe to a user.
exports.unsubscribe_to_user = function (req, res) {

    console.log("Unsubscribing " + req.body.subscriber + " from " + req.body.subscribee + "...");

    var subscriber = req.body.subscriber;
    var subscribee = req.body.subscribee;

    //  Update subcriber's subscription list.
    Users.findOneAndUpdate(
        { _id: subscriber },
        { $pull: { user_subscribed_to: subscribee } }, function(err, data) {
            if(data) {
                console.log("Success.");
                res.send("success");
            } else {
                console.log("Error: " + err);
                res.send("failure");
            }
        }
    );
}

//  Update subscribee's follower list by adding user.
exports.subscribee_add_follower = function (req, res) {

    console.log("Updating follower list for: " + req.body.subscribee + " (addition)...");

    var subscriber = req.body.subscriber;
    var subscribee = req.body.subscribee;

    Users.findOneAndUpdate(
        { _id: subscribee },
        { $push: { user_subscribers: subscriber } }, function(err, data) {
            if(data) {
                console.log("Success.");
                res.send("success");
            } else {
                console.log("Error: " + err);
                res.send("failure");
            }
        }
    );
}

//  Update subscribee's follower list by removing user.
exports.subscribee_remove_follower = function (req, res) {

    console.log("Updating follower list for: " + req.body.subscribee + " (removal)...");

    var subscriber = req.body.subscriber;
    var subscribee = req.body.subscribee;

    Users.findOneAndUpdate(
        { _id: subscribee },
        { $pull: { user_subscribers: subscriber } }, function(err, data) {
            if(data) {
                console.log("Success.");
                res.send("success");
            } else {
                console.log("Error: " + err);
                res.send("failure");
            }
        }
    );
}

//  Check whether a user is subscribed to another user.
exports.check_user_subscription = function (req, res) {

    console.log("Checking user subscription information...");

    var subscriber = req.body.subscriber;
    var subscribee = req.body.subscribee;

    Users.find({_id: subscriber}, function(err, user) {
        if(user.length) {
            var subscribedToArray = user[0].user_subscribed_to;
            var found;
            for(var i = 0; i < subscribedToArray.length; i++) {
                if(subscribedToArray[i] == subscribee) {
                    found = true;
                    break;
                }
            }

            if(found) {
                console.log("User found, sending true...");
                res.send(true);
            } else {
                console.log("No user found, returning false...");
                res.send(false);
            }
        } else {
            console.log("Error: " + err);
        }
    });
}



/*****  All review related functionality    *****/

//  Create a new review.
exports.create_a_review = function(req, res) {

    console.log("Adding a new review...");

    var new_review = new Reviews(req.body);
    
    new_review.save(function(err, review) {
        if(err) {
            res.send("failure");
            console.log("There was an error creating the review.");
            console.log("Error: " + err);
        } else {
            res.send(review._id);
            console.log("The review has been created successfully.");
        }       
    });
}

//  Get a user's reviews.
exports.get_user_reviews = function(req, res) {
    
    console.log("Fetching reviews for " + req.params.userID + "...");

    Reviews.find({user_id: req.params.userID}, function(err, reviews) {
        if(reviews.length) {
            res.send(reviews);
            console.log("Reviews have been found.");
        } else {
            res.send(false);
            console.log("No reviews were found.");
            console.log("Error: " + err);
        }
    });
}

//  Add review ID to game and user.
exports.add_review_ids = function(req, res) {
    
    console.log("Adding review ids...");

    var userID      = req.body.user_id;
    var gameID      = req.body.game_id;
    var reviewID    = req.body.review_id;

    //  Add review ID to user's collection.
    Users.findOneAndUpdate(
        { _id: userID },
        { $push: { user_reviews: reviewID } }, function(err, data) {
            if(data) {
                console.log("Success.");
            } else {
                console.log("Error: " + err);
            }
        }
    );

    //  Add review ID to game's collection.
    Games.findOneAndUpdate(
        { _id: gameID },
        { $push: { game_reviews: reviewID } }, function(err, data) {
            if(data) {
                console.log("Success.");
            } else {
                console.log("Error: " + err);
            }
        }
    );
}

//  View all reviews for a particular game.
exports.view_game_reviews = function(req, res) {

    console.log("Fetching reviews for game: " + req.params.gameID);

    Reviews.find({game_id: req.params.gameID}, function(err, reviews) {
        if(reviews.length) {
            res.send(reviews);
            console.log("Reviews have been found.");
        } else {
            res.send(false);
            console.log("No reviews were found.");
            console.log("Error: " + err);
        }
    });
}

//  Delete a review from the database from supplied ID.
exports.delete_a_review = function(req, res) {
    
    console.log("A review is being deleted...");

    Reviews.deleteOne({
        _id: req.params.reviewID        
    }, function(err, review) {
        if (err)
            res.send(err);
        res.json({ message: 'Review was successfully deleted.'});
    });
};