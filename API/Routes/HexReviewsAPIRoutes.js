'use strict';

module.exports = function(app) {
    var hexReviewController = require('../Controllers/HexReviewsAPIController');

    //  All Hex Reviews routes.
    app.route('/games')
        .get(hexReviewController.list_all_games)
        .post(hexReviewController.create_a_game);
    
    app.route('/games/:gameID')
        .get(hexReviewController.list_a_game)
        .put(hexReviewController.update_a_game)
        .delete(hexReviewController.delete_a_game);

    app.route('/images/game')
        .post(hexReviewController.create_an_image);
};