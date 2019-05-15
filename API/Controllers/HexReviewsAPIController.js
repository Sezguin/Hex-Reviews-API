'use strict';

var mongoose = require('mongoose');
var fs = require('fs');

var Games = mongoose.model('Games');
var GameImages = mongoose.model('GameImages');
var Users = mongoose.model('Users');
var Reviews = mongoose.model('Reviews');
var Requests = mongoose.model('Requests');



/*****  All game related functionality  *****/

//  List all games in the database.
exports.list_all_games = function (req, res) {
    Games.find({}, function (err, game) {
        if (err)
            res.send(err);
        res.json(game);
    });
};

//  Create a new game in the database.
exports.create_a_game = function (req, res) {

    console.log("A new game is being created...");

    var new_game = new Games(req.body);

    new_game.save(function (err, game) {
        if (err) {
            res.send("failure");
            console.log("There was an error creating the new game.");
        } else {
            res.send("success");
            console.log("A new game has been created successfully.");
        }
    });
};

//  List a single game from the database, by using supplied ID.
exports.list_a_game = function (req, res) {
    Games.findById(req.params.gameID, function (err, game) {
        if (err)
            res.send(err);
        res.json(game);
    });
};

//  Update a game in the database.
exports.update_a_game = function (req, res) {
    Games.findOneAndUpdate({ _id: req.params.gameID }, req.body, { new: true }, function (err, game) {
        if (err)
            res.send(err);
        res.json(game);
    });
};

//  Delete a game from the database.
exports.delete_a_game = function (req, res) {

    console.log("A game is being deleted...");

    Games.deleteOne({
        _id: req.params.gameID
    }, function (err, game) {
        if (err)
            res.send(err);
        res.json({ message: 'Game was successfully deleted.' });
    });
};

//  Get games from a search.
exports.list_games_from_search = function (req, res) {

    console.log("Searching for specific games containing " + req.params.query + "...");

    Games.find({ $text: { $search: req.params.query } }, function (err, games) {
        if (err) {
            console.log("There was an error when retrieving the games.");
            console.log("Error: " + err);
        } else {
            res.send(games);
        }
    });
}

//  Add a game rating.
exports.add_game_rating = function (req, res) {

    console.log("Adding a game rating..." + req.body.rating);

    Games.findOneAndUpdate(
        { _id: req.body.game_id },
        { $push: { game_rating: req.body.rating } }, function (err, data) {
            if (data) {
                console.log("Success.");
                res.send(true);
            } else {
                console.log("Error: " + err);
                res.send(false);
            }
        }
    );
}



/*****  All image related functionality.    *****/

//  Delete a game image from the database.
exports.delete_game_image = function (req, res) {

    console.log("A game image is being deleted...");

    GameImages.deleteOne({
        _id: req.params.imageID
    }, function (err) {
        if (err) {
            console.log("There was an error: " + err);
        } else {
            console.log("Game image was successfully deleted.");
        }
    });
};

//  Get a user's avatar.
exports.get_an_avatar = function (req, res) {

    console.log("Fetching user avatar...");

    Users.find({ user_username: req.params.userID }, function (err, user) {
        if (user.length) {
            console.log("Sending avatar data...");
            res.send(user[0].user_avatar);
        } else {
            console.log("Unexpected error when retrieving avatar from the database...");
            console.log("Perhaps the user has been deleted?");
            res.send(false);
        }
    });
}

//  Create a new image in the database.
exports.create_an_image = function (req, res) {

    console.log("A new game image is being created...");

    var new_game_image = new GameImages(req.body);

    console.log("Creating image for: " + new_game_image.game_title);

    new_game_image.save(function (err, game_image) {
        if (err)
            res.send(err);
        res.json(game_image._id);
    });
};


//  Retrieve an image by supplied ID.
exports.get_an_image = function (req, res) {

    console.log("An image is being listed...");

    GameImages.findById(req.params.imageID, function (err, game_image) {
        if (err)
            res.send(err);
        res.json(game_image);
    });
};




/*****  All user related functionality. *****/

//  Create a user in the database.
exports.create_a_user = function (req, res) {

    console.log("A user is being created...");

    var new_user = new Users(req.body);

    new_user.save(function (err, user) {
        if (err) {
            res.send("failure");
            console.log("There was an error when creating a user in the database.");
            console.log("Error: " + err);
        } else {
            res.send("success");
            console.log("The new user has been created successfully.");
        }
    });
}

//  Delete a game image from the database.
exports.delete_a_user = function (req, res) {

    console.log("A user is being deleted...");

    Users.deleteOne({
        _id: req.params.userID
    }, function (err) {
        if (err) {
            console.log("There was an error: " + err);
        } else {
            console.log("User was successfully deleted.");
        }
    });
};

//  Update a user in the database.
exports.update_a_user = function (req, res) {

    console.log("Updating a user in the database...")

    Users.findOneAndUpdate({ _id: req.params.userID }, req.body, { new: true }, function (err, user) {
        if (err) {
            console.log("There was an error when updating the user in the database.")
            console.log("Error: " + err);
            res.send(false);
        } else {
            res.send(true);
        }
    });
};

//  Check a username exists in the database.
exports.check_a_username = function (req, res) {

    console.log("Checking if " + req.params.username + " exists...");

    Users.find({ user_username: req.params.username }, function (err, user) {
        if (user.length) {
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
exports.get_user_id = function (req, res) {

    console.log("Retrieving ID of user " + req.params.username + "...");

    Users.find({ user_username: req.params.username }, function (err, user) {
        if (user.length) {
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
exports.get_a_user = function (req, res) {

    console.log("Retrieving username for user");

    Users.find({ _id: req.params.userID }, function (err, user) {
        if (user.length) {
            console.log("Sending user ID...");
            res.send(user[0]);
        } else {
            console.log("There was an error when retrieving " + req.params.userID + " from the database.");
            console.log("Error: " + err);
            res.send(false);
        }
    });
}

//  Check that the submitted password is correct.
exports.check_user_password = function (req, res) {

    console.log("Checking password for " + req.body.user_username + "...");

    Users.find({ user_username: req.body.user_username }, function (err, user) {
        if (user.length) {
            if (req.body.user_password === user[0].user_password) {
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
        { $push: { user_subscribed_to: subscribee } }, function (err, data) {
            if (data) {
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
        { $pull: { user_subscribed_to: subscribee } }, function (err, data) {
            if (data) {
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
        { $push: { user_subscribers: subscriber } }, function (err, data) {
            if (data) {
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
        { $pull: { user_subscribers: subscriber } }, function (err, data) {
            if (data) {
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

    Users.find({ _id: subscriber }, function (err, user) {
        if (user.length) {
            var subscribedToArray = user[0].user_subscribed_to;
            var found;
            for (var i = 0; i < subscribedToArray.length; i++) {
                if (subscribedToArray[i] == subscribee) {
                    found = true;
                    break;
                }
            }

            if (found) {
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

//  Get a list of user subscription from supplied ID.
exports.get_user_subscriptions = function (req, res) {

    console.log("Fetching list of user subscriptions...");

    Users.findById(req.params.userID, function (err, user) {
        if (err) {
            console.log("There was an error when trying to retrieve the subscription list.")
            console.log("Error: " + err);
        } else {
            console.log("User has been found, sending subscription list...");
            if (user.user_subscribed_to === undefined || user.user_subscribed_to.length == 0) {
                res.send(false);
            } else {
                res.send(user.user_subscribed_to);
            }
        }
    });
}

//  Calculate the rank of a user.
exports.get_user_rank = function (req, res) {

    console.log("Getting user rank...");

    Users.findById(req.params.userID, function (err, user) {
        if (err) {
            console.log("There was an error when trying to calculate the user's rank.")
            console.log("Error: " + err);
        } else {
            console.log("User has been found, sending subscription list...");
            if (user.user_reviews === undefined || user.user_reviews.length == 0) {
                res.send("Baby");
            } else {
                var totalReviews = user.user_reviews.length;

                console.log("Total reviews for user: " + totalReviews);

                if (1 <= totalReviews && totalReviews < 10) {
                    console.log("User is a novice.");
                    res.send("Novice");
                } else if (10 <= totalReviews && totalReviews < 20) {
                    console.log("User is an apprentice.");
                    res.send("Apprentice");
                } else if (20 <= totalReviews && totalReviews < 50) {
                    console.log("User is an adept.");
                    res.send("Adept");
                } else if (50 <= totalReviews && totalReviews < 100) {
                    console.log("User is an expert.");
                    res.send("Expert");
                } else if (100 <= totalReviews && totalReviews < 500) {
                    console.log("User is a master.");
                    res.send("Master");
                } else if (500 <= totalReviews && totalReviews < 1000) {
                    console.log("User is a legend.")
                    res.send("Legend");
                } else if (1000 <= totalReviews && totalReviews < 5000) {
                    console.log("User is a king.")
                    res.send("King");
                } else if (5000 <= totalReviews && totalReviews < 10000) {
                    console.log("User is a God.")
                    res.send("God");
                } else if (10000 <= totalReviews) {
                    console.log("User is... The one.")
                    res.send("The One");
                } else {
                    console.log("Default of novice.");
                    res.send("Novice");
                }
            }
        }
    });
}

//  Get the follower count of a user from supplied ID.
exports.get_user_followers = function (req, res) {

    console.log("Getting user follower count...");

    Users.findById(req.params.userID, function (err, user) {
        if (err) {
            console.log("There was an error when trying to retrieve the follower list.")
            console.log("Error: " + err);
        } else {
            console.log("User has been found, sending follower count..." + user.user_subscribers.length);
            if (user.user_subscribers === undefined || user.user_subscribers.length == 0) {
                res.send(false);
            } else {
                res.send(user.user_subscribers);
            }
        }
    });
}

//  Check the status of a user's cookie acceptance.
exports.check_user_cookies = function (req, res) {

    console.log("Checking status of cookies...");

    Users.findById(req.params.userID, function (err, user) {
        if (err) {
            console.log("There was an error when trying to retrieve the user.")
            console.log("Error: " + err);
        } else {
            if (user.user_accept_cookies) {
                res.send(true);
            } else {
                res.send(false);
            }
        }
    });
}

//  Check the status of a user's cookie acceptance.
exports.accept_user_cookies = function (req, res) {

    console.log("Accepting cookies...");

    Users.findById(req.params.userID, function (err, user) {
        if (err) {
            console.log("There was an error when trying to retrieve the user.")
            console.log("Error: " + err);
            res.send(false);
        } else {
            user.user_accept_cookies = true;
            user.save();
            res.send(true);
        }
    });
}




/*****  All review related functionality    *****/

//  Sort all reviews by date.
exports.sort_reviews_date = function (req, res) {
    Reviews.find({}, function (err, reviews) {
        if (err) {
            console.log("There was an error when retrieving all the reviews from the database.");
            console.log("Error: " + err);
            res.send(false);
        } else {
            reviews.sort(function (a, b) {
                console.log("sorting");
                var dateA = new Date(a.review_creation_date);
                var dateB = new Date(b.review_creation_date);
                return dateB - dateA;
            });
            res.send(reviews)
        }
    });
}

//  List all reviews from the database.
exports.get_all_reviews = function (req, res) {
    Reviews.find({}, function (err, reviews) {
        if (err) {
            console.log("There was an error when retrieving all the reviews from the database.");
            console.log("Error: " + err);
            res.send(false);
        } else {
            res.send(reviews)
        }
    });
};

//  Create a new review.
exports.create_a_review = function (req, res) {

    console.log("Adding a new review...");

    var new_review = new Reviews(req.body);

    new_review.save(function (err, review) {
        if (err) {
            res.send(false);
            console.log("There was an error creating the review.");
            console.log("Error: " + err);
        } else {
            res.send(review._id);
            console.log("The review has been created successfully.");
        }
    });
}

//  Get a user's reviews.
exports.get_user_reviews = function (req, res) {

    console.log("Fetching reviews for " + req.params.userID + "...");

    Reviews.find({ user_id: req.params.userID }, function (err, reviews) {
        if (reviews.length) {
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
exports.add_review_ids = function (req, res) {

    console.log("Adding review ids...");

    var userID = req.body.user_id;
    var gameID = req.body.game_id;
    var reviewID = req.body.review_id;

    //  Add review ID to user's collection.
    Users.findOneAndUpdate(
        { _id: userID },
        { $push: { user_reviews: reviewID } }, function (err, data) {
            if (data) {
                console.log("Success.");
            } else {
                console.log("Error: " + err);
            }
        }
    );

    //  Add review ID to game's collection.
    Games.findOneAndUpdate(
        { _id: gameID },
        { $push: { game_reviews: reviewID } }, function (err, data) {
            if (data) {
                console.log("Success.");
            } else {
                console.log("Error: " + err);
            }
        }
    );
}

//  View all reviews for a particular game.
exports.view_game_reviews = function (req, res) {

    console.log("Fetching reviews for game: " + req.params.gameID);

    Reviews.find({ game_id: req.params.gameID }, function (err, reviews) {
        if (reviews.length) {
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
exports.delete_a_review = function (req, res) {

    console.log("A review is being deleted...");

    Reviews.deleteOne({
        _id: req.params.reviewID
    }, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.send(true);
        }
    });
};

exports.delete_user_reviews = function (req, res) {

    console.log("Removing reviews from User...");

    Users.findOneAndUpdate(
        { _id: req.body.userId },
        { $pull: { user_reviews: req.body.reviewId } }, function (err, data) {
            if (data) {
                console.log("Success.");
                res.send("success");
            } else {
                console.log("Error: " + err);
                res.send("failure");
            }
        }
    );
}

exports.get_a_review = function (req, res) {

    console.log("Fetching a review...");

    Reviews.findById(req.params.reviewID, function (err, review) {
        if (err) {
            console.log("There was an error when trying to retrieve the review.")
            console.log("Error: " + err);
        } else {
            console.log("A review has been found.");

            res.send(review);
        }
    });
}

//  Get reviews from a search.
exports.search_for_reviews = function (req, res) {

    console.log("Searching for specific games containing " + req.params.query + "...");

    Reviews.find({ $text: { $search: req.params.query } }, function (err, reviews) {
        if (err) {
            console.log("There was an error when retrieving the reviews.");
            console.log("Error: " + err);
        } else {
            res.send(reviews);
        }
    });
}

//  Get the latest review of a user from supplied ID.
exports.get_latest_user_review = function (req, res) {

    console.log("Getting the latest review form a user...");

    Reviews.find({ user_id: req.params.userID }, function (err, reviews) {
        if (reviews.length) {
            reviews.sort(function (a, b) {
                var dateA = new Date(a.review_creation_date);
                var dateB = new Date(b.review_creation_date);
                return dateB - dateA;
            });
            res.send(reviews[0]);
            console.log("Latest review has been sent.");
        } else {
            res.send(false);
            console.log("No reviews were found.");
            console.log("Error: " + err);
        }
    });
}



/*****  All comment related functionality.  *****/

//  Create a comment.
exports.create_a_comment = function (req, res) {

    console.log("Creating a comment in the database...");

    var reviewID = req.body.review_id;
    var userID = req.body.comment_user_id;
    var commentContent = req.body.comment_content;

    Reviews.findOneAndUpdate(
        { _id: reviewID }, {
            $push: {
                review_comments: {
                    comment_content: commentContent,
                    comment_user_id: userID
                }
            }
        }, function (err, data) {
            if (err) {
                console.log("Error: " + err);
                res.send(false);
            } else {
                res.send(true);
            }
        }
    )
}

//  Delete a comment.
exports.delete_a_comment = function (req, res) {
    console.log("Deleting a comment...");

    var reviewID = req.body.review_id;
    var commentID = req.body.comment_id;

        Reviews.findOneAndUpdate(
        { _id: reviewID }, 
        { $pull: { review_comments: {_id: commentID}  } }, {multi: true}, function (err) {
            if (err) {
                console.log("Error: " + err);
                res.send(false);
            } else {
                console.log("Comment removed.")
                res.send(true);
            }
        }
    )
}


//  Get all comments for a specific review.
exports.get_all_comments = function (req, res) {

    console.log("Fetching all comments...");

    var reviewID = req.params.reviewID;

    Reviews.findById(reviewID, function (err, review) {
        if (err) {
            console.log("There was an error when trying to fetch that review.");
            console.log("Error: " + err);
            res.send(false);
        } else {
            console.log("Review found, sending comments...");
            res.send(review.review_comments);
        }
    });
}


//  Like a comment.
exports.like_a_comment = function (req, res) {
    console.log("Liking a comment...");

    var commentID = req.body.comment_id;
    var reviewID = req.body.review_id;
    var userID = req.body.user_id;

    Reviews.find(
        { _id: reviewID },
        { review_comments: { $elemMatch: { _id: commentID } } }, function (err, comment) {
            if (err) {
                console.log("There was an error when retrieving that comment.");
                console.log("Error: " + err);
            } else {
                comment[0].review_comments[0].comment_likes.push(userID);
                comment[0].save();
            }
        }
    )
}

//  Unike a comment.
exports.unlike_a_comment = function (req, res) {
    console.log("Unliking a comment...");

    var commentID = req.body.comment_id;
    var reviewID = req.body.review_id;
    var userID = req.body.user_id;

    Reviews.find(
        { _id: reviewID },
        { review_comments: { $elemMatch: { _id: commentID } } }, function (err, comment) {
            if (err) {
                console.log("There was an error when retrieving that comment.");
                console.log("Error: " + err);
            } else {
                comment[0].review_comments[0].comment_likes.pop(userID);
                comment[0].save();
            }
        }
    )
}



/*****  All request related functionality.  *****/

//  Get all requests.
exports.get_all_requests = function (req, res) {

    console.log("Retrieving all game requests...");

    Requests.find({}, function (err, requests) {
        if (err) {
            console.log("There was an error retrieving all requests.");
            console.log("Error: " + err);
        } else {
            res.send(requests);
        }
    });

}

//  Get all user requests from supplied ID.
exports.get_user_requests = function (req, res) {

    console.log("Getting all requests for user...");

    Requests.find({ request_user_id: req.params.userID }, function (err, requests) {
        if (requests.length) {
            res.send(requests);
            console.log("Requests have been found.");
        } else {
            res.send(false);
            console.log("No requests were found.");
            console.log("Error: " + err);
        }
    });

}

//  Create a new request.
exports.create_a_request = function (req, res) {

    console.log("Creating a new request for: " + req.body.gameTitle);

    var new_request = new Requests(req.body);

    new_request.save(function (err) {
        if (err) {
            res.send(false);
            console.log("There was an error creating the new request.");
            console.log("Error: " + err);
        } else {
            res.send(true);
            console.log("A new game request has been created successfully.");
        }
    });
}

//  Reject a request.
exports.reject_a_request = function (req, res) {

    console.log("Rejecting a request...");

    console.log("Request ID: " + req.body.request_id);

    Requests.findOne({ _id: req.body.request_id }, function (err, request) {
        if (request) {
            request.request_state = "REJECTED";
            request.request_reject_reason = req.body.rejection_reason;
            request.save(function (err) {
                if (err) {
                    console.log("There was an error saving the document " + err);
                } else {
                    res.send(true);
                }
            });
        } else {
            console.log("There was an error during rejection.");
            console.log("Error: " + err);
            res.send(false);
        }
    });
}

//  Complete a request.
exports.complete_a_request = function (req, res) {

    console.log("Completing a request...");

    console.log("Request ID: " + req.body.request_id);

    Requests.findOne({ _id: req.body.request_id }, function (err, request) {
        if (request) {
            request.request_state = "COMPLETE";
            request.save(function (err) {
                if (err) {
                    console.log("There was an error saving the document " + err);
                } else {
                    res.send(true);
                }
            });
        } else {
            console.log("There was an error during rejection.");
            console.log("Error: " + err);
            res.send(false);
        }
    });
}