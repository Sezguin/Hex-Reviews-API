'use strict';

module.exports = function(app) {
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



    /*****  All game image realted routes.  *****/

    //  Creating new images.
    app.route('/images/game')
        .post(hexReviewController.create_an_image);

    //  Retrieve a specific image.
    app.route('/images/game/:imageID')
        .get(hexReviewController.get_an_image)

    

    /*****  All user related routes.    *****/

    //  Creating a new user.
    app.route('/users')
        .post(hexReviewController.create_a_user);
};