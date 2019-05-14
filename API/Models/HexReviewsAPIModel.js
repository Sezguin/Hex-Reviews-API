'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//  Schema for games.
var GameSchema = new Schema({
    //  The title of the game.
    game_title: {
        type: String,
        required: 'A game title is required to create a new game in the database.'
    },
    //  A description of the game.
    game_description: {
        type: String,
        default: 'No description information has been added yet.'
    },
    //  Genre tags to be used in an Array.
    game_genre_tags: {
        type: Array,
        default: []
    },
    //  The developer of the game.
    game_developer: {
        type: String,
        default: 'No developer information has been added yet.'
    },
    //  The publisher of the game.
    game_publisher: {
        type: String,
        default: 'No publisher information has been added yet.'
    },
    //  Tags to describe the age restrictions on the game, arranged in an Array.
    game_age_rating_tags: {
        type: Array,
        default: []
    },
    //  When the game was first released.
    game_release_date: {
        type: Date,
        default: '2000-01-01'
    },
    //  The average rating of the game is to be calculated here.
    game_rating: {
        type: Array,
        default: []
    },
    //  Boolean to represent whether the game has online features or not.
    game_online: {
        type: Boolean,
        default: null
    },
    //  Tags to show which platform the game is available on.
    game_platform_tags: {
        type: Array,
        default: []
    },
    //  Timestamp for when the game object was created.
    game_creation_date: {
        type: Date,
        default: Date.now
    },
    //  How much the game cost upon launch.
    game_launch_price: {
        type: Number,
        default: 0.0
    },
    //  An array of image ID references.
    game_images_id: {
        type: Array,
        default: []
    },
    //  An array of review ID references.
    game_reviews: {
        type: Array,
        default: []
    }
});

//  Schema for game images.
var GameImageSchema = new Schema({
    //  Title of the game, for reference purposes.
    game_title: {
        type: String,
        default: ""
    },
    //  Timestamp for when the image object was created.
    image_creation_date: {
        type: Date,
        default: Date.now
    },
    //  String field to hold the data of the image.
    game_image_data: {
        type: String,
        default: ""
    }
});

//  Schema for users.
var UserSchema = new Schema({
    //  Email address of the user.
    user_email: {
        type: String,
        required: 'An email is required to create an account.'
    },
    //  Password of the user.
    user_password: {
        type: String,
        required: 'A password is required to create an account.'
    },
    //  Username of the user.
    user_username: {
        type: String,
        required: 'A username is required to create an account.'
    },
    //  String field to hold the data of the user's avatar.
    user_avatar: {
        type: String,
        default: ""
    },
    //  Rank of the user.
    user_rank: {
        type: String,
        default: 'Novice'
    },
    //  Boolean field to determine whether the user in an Admin or not.
    user_admin: {
        type: Boolean,
        default: false
    },
    //  An array of user references, to whom the user is subscribed to.
    user_subscribed_to: {
        type: Array,
        default: []
    },
    //  An array of users who are subscribed to the user.
    user_subscribers: {
        type: Array,
        default: []
    },
    //  An array of references to the user's reviews.
    user_reviews: {
        type: Array,
        default: []
    },
    //  Timestamp for when the user was created.
    user_creation_date: {
        type: Date,
        default: Date.now
    },
    //  Boolean for whether the user has accepted cookies.
    user_accept_cookies: {
        type: Boolean,
        default: false
    }
});

//  A schema for the reviews.
var ReviewSchema = new Schema({
    //  Title of the review, the same as the title of the game reviewed.
    review_title: {
        type: String,
        required: "A review title is required."
    },
    //  Review summary.
    review_subtitle: {
        type: String,
        required: "A review quote is required."
    },
    //  All review content.
    review_content: {
        type: String,
        required: "A review is required."
    },
    //  Review rating.
    review_rating: {
        type: Number,
        required: "A review rating is required."
    },
    review_comments: {
        type: Array,
        default: []
    },
    //  Timestamp from when the review was created.
    review_creation_date: {
        type: Date,
        default: Date.now
    },
    //  All review comment details.
    review_comments: [{
        comment_user_id: String,
        comment_content: String,
        comment_creation_date: {
            type: Date,
            default: Date.now
        },
        comment_likes: {
            type: Array,
            default: []
        },
        comment_dislikes: {
            type: Array,
            default: []
        }
    }],
    //  ID of game being reviewed.
    game_id: {
        type: Array,
        default: []
    },
    //  ID of user reviewing the game.
    user_id: {
        type: Array,
        default: []
    }
});

//  Schema for game requests.
var RequestSchema = new Schema({
    //  Title of game to be requested.
    request_game_title: {
        type: String,
        required: "A game title is required for the request."
    },
    //  Additional information for request.
    request_game_info: {
        type: String,
        default: ""
    },
    //  Enumeration of states the request can be in.
    request_state: {
        type: String,
        enum: ['OPEN', 'COMPLETE', 'REJECTED'],
        default: 'OPEN'
    },
    //  User ID from request.
    request_user_id: {
        type: String,
        default: ""
    },
    //  Reason (if applicable) for rejecting the request.
    request_reject_reason: {
        type: String,
        default: ""
    },
    // Timestamp for the creation date of the request.
    request_creation_date: {
        type: Date,
        default: Date.now
    }
});



/*****  Indexes for searching.   *****/

//  Game title and description index.
GameSchema.index({
    game_title: 'text',
    game_description: 'text',    
}, {
    weights: {
        game_title: 5,
        game_description: 1,
    },
});

//  Review title and subtitle index.
ReviewSchema.index({
    review_title: 'text',
    review_subtitle: 'text',    
}, {
    weights: {
        review_title: 5,
        review_subtitle: 1,
    },
});

//  User's username index.
UserSchema.index({
    user_username: 'text'
}, {
    weights: {
        user_username: 5
    },
});



/*****  Exporting all schemas.  *****/

module.exports = mongoose.model('Games', GameSchema);
module.exports = mongoose.model('GameImages', GameImageSchema);
module.exports = mongoose.model('Users', UserSchema);
module.exports = mongoose.model('Reviews', ReviewSchema);
module.exports = mongoose.model('Requests', RequestSchema);