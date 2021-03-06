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

    //  Add a game rating.
    app.route('/games/rating')
        .post(hexReviewController.add_game_rating);



    /*****  All game image related routes.  *****/

    //  Creating new images.
    app.route('/images/game')
        .post(hexReviewController.create_an_image);

    //  Retrieve a specific image or delete a specific image.
    app.route('/images/game/:imageID')
        .get(hexReviewController.get_an_image)
        .delete(hexReviewController.delete_game_image);
    
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
    
    //  Get or update a user from provided ID.
    app.route('/users/:userID')
        .get(hexReviewController.get_a_user)
        .put(hexReviewController.update_a_user)
        .delete(hexReviewController.delete_a_user);

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

    //  Calculate the rank of a user.
    app.route('/users/rank/:userID')
        .get(hexReviewController.get_user_rank);

    //  Get user follower count from supplied ID.
    app.route('/users/followers/:userID')
        .get(hexReviewController.get_user_followers);

    //  Check cookies acceptance.
    app.route('/users/cookies/check/:userID')
        .get(hexReviewController.check_user_cookies);
    
    //  Accept cookies for user.
    app.route('/users/cookies/accept/:userID')
        .get(hexReviewController.accept_user_cookies);



    /*****  All review related routes.  *****/

    //  Creating a new review or getting all reviews.
    app.route('/reviews')
        .post(hexReviewController.create_a_review)
        .get(hexReviewController.get_all_reviews);

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

    //  Get a list of searched for games from supplied query.
    app.route('/reviews/search/:query')
        .get(hexReviewController.search_for_reviews);

    //  Get the latest review of a user from supplied ID.
    app.route('/reviews/user/latest/:userID')
        .get(hexReviewController.get_latest_user_review);

    //  Return a sorted array of review by date.
    app.route('/reviews/sort/date')
        .get(hexReviewController.sort_reviews_date);

    //  Delete user reviews.
    app.route('/reviews/delete')
        .post(hexReviewController.delete_user_reviews);


    
    /*****  All comment related routes. *****/

    //  Create a new comment.
    app.route('/reviews/comment')
        .post(hexReviewController.create_a_comment);

    //  Delete a comment.
    app.route('/reviews/delete/comment')
        .post(hexReviewController.delete_a_comment);

    //  Get all comments for a specific review.
    app.route('/reviews/comment/:reviewID')
        .get(hexReviewController.get_all_comments);

    app.route('/reviews/comment/like')
        .post(hexReviewController.like_a_comment);

    app.route('/reviews/comment/unlike')
        .post(hexReviewController.unlike_a_comment);



    /*****  All request related routes. *****/

    //  Create and get requests.
    app.route('/requests/')
        .post(hexReviewController.create_a_request)
        .get(hexReviewController.get_all_requests);

    //  Get a request from a user ID.
    app.route('/requests/:userID')
        .get(hexReviewController.get_user_requests);

    //  Reject a request.
    app.route('/requests/reject')
        .post(hexReviewController.reject_a_request);

    //  Complete a request.
    app.route('/requests/complete')
        .post(hexReviewController.complete_a_request);
};