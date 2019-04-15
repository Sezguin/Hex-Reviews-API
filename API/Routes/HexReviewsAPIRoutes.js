'use strict';

module.exports = function(app) {

    //  Import controller.
    var hexReviewController = require('../Controllers/HexReviewsAPIController');

    /*****  All game related routes.    *****/

    //  Listing and creating games.
    app.route('/games')
        .get(hexReviewController.list_all_games)
        .post(hexReviewController.create_a_game);
    
    //  Listing, deleting and updating a specific game.
    app.route('/games/:gameID')
        .get(hexReviewController.list_a_game)
        .put(hexReviewController.update_a_game)
        .delete(hexReviewController.delete_a_game);

    //  Get list of games from a search query.
    app.route('/games/search/:query')
        .get(hexReviewController.list_games_from_search);



    /*****  All game image related routes.  *****/

    //  Creating new images.
    app.route('/images/game')
        .post(hexReviewController.create_an_image);

    //  Retrieve a specific image.
    app.route('/images/game/:imageID')
        .get(hexReviewController.get_an_image);
    
    //  Retrieve a user's avatar.
    app.route('/images/avatar/:userID')
        .get(hexReviewController.get_an_avatar);

    

    /*****  All user related routes.    *****/

    //  Creating a new user.
    app.route('/users')
        .post(hexReviewController.create_a_user);

    //  Check whether a username exists within the database.
    app.route('/username/login/:username')
        .get(hexReviewController.check_a_username);

    //  Check the provided password is correct.
    app.route('/username/login')
        .post(hexReviewController.check_user_password);

    //  Retrieve a user's ID from supplied username.
    app.route('/users/id/:username')
        .get(hexReviewController.get_user_id);
    
    //  Get a user from provided ID.
    app.route('/users/:userID')
        .get(hexReviewController.get_a_user);

    //  Subscribe to a user from provided ID.
    app.route('/users/subscribe')
        .post(hexReviewController.subscribe_to_user);
    
    //  Unsubscribe to a user from provided ID.
    app.route('/users/unsubscribe')
        .post(hexReviewController.unsubscribe_to_user);

    //  Add follower to subscribee's list.
    app.route('/users/follower')
        .post(hexReviewController.subscribee_add_follower);
    
    //  Remove follower from subscribee's list.
    app.route('/users/unfollow')
        .post(hexReviewController.subscribee_remove_follower);

    //  Check if user exists in another user's subscription list.
    app.route('/users/subscribe/check')
        .post(hexReviewController.check_user_subscription);
    
    //  Get subcription list of user from supplied ID.
    app.route('/users/subscriptions/:userID')
        .get(hexReviewController.get_user_subscriptions);



    /*****  All review related routes.  *****/

    //  Creating a new review.
    app.route('/reviews')
        .post(hexReviewController.create_a_review);

    //  Getting a user's reviews.
    app.route('/reviews/:userID')
        .get(hexReviewController.get_user_reviews);

    //  Update review IDs in games and users.
    app.route('/reviews/add/ids')
        .post(hexReviewController.add_review_ids);

    //  View game reviews from ID.
    app.route('/reviews/game/:gameID')
        .get(hexReviewController.view_game_reviews);

    //  Delete a review from the database from supplied ID.
    app.route('/reviews/:reviewID')
        .delete(hexReviewController.delete_a_review)
        
    //  Get a single review from supplied ID.
    app.route('/reviews/single/:reviewID')
        .get(hexReviewController.get_a_review);


    
    /*****  All comment related routes. *****/

    //  Create a new comment.
    app.route('/reviews/comment')
        .post(hexReviewController.create_a_comment);

    //  Get all comments for a specific review.
    app.route('/reviews/comment/:reviewID')
        .get(hexReviewController.get_all_comments);
};