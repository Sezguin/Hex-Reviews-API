'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = new Schema({
    game_title: {
        type: String,
        required: 'A game title is required to create a new game in the database.'
    },
    game_description: {
        type: String,
        default: 'No description information has been added yet.'
    },
    game_genre_tags: {
        type: Array,
        default: []
    },
    game_developer: {
        type: String,
        default: 'No developer information has been added yet.'
    },
    game_publisher: {
        type: String,
        default: 'No publisher information has been added yet.'
    },
    game_age_rating_tags: {
        type: Array,
        default: []
    },
    game_release_date: {
        type: Date,
        default: '2000-01-01'
    },
    game_rating: {
        type: Number,
        default: 0.0
    },
    game_online: {
        type: Boolean,
        default: null
    },
    game_platform_tags: {
        type: Array,
        default: []
    },
    game_creation_date: {
        type: Date,
        default: Date.now
    },
    game_launch_price: {
        type: Number,
        default: 0.0
    },
    game_images_id: {
        type: Array,
        default: []
    }
});

var GameImageSchema = new Schema({
    game_title: {
        type: String,
        default: ""
    },
    image_creation_date: {
        type: Date,
        default: Date.now
    },
    game_image_data: {
        type: String,
        default: ""
    }
});

var UserSchema = new Schema({
    user_email: {
        type: String,
        required: 'An email is required to create an account.'
    },
    user_password: {
        type: String,
        required: 'A password is required to create an account.'
    },
    user_username: {
        type: String,
        required: 'A username is required to create an account.'
    },
    user_avatar: {
        type: String,
        default: ""
    },
    user_rank: {
        type: String,
        default: 'Novice'
    },
    user_admin: {
        type: Boolean,
        default: false
    },
    user_subscribed_to: {
        type: Array,
        default: []
    },
    user_subscribers: {
        type: Array,
        default: []
    }
});



/*****  Indexes for searching.   *****/

//  Game title index.
GameSchema.index({
    game_title: 'text',
    game_description: 'text',    
}, {
    weights: {
        game_title: 5,
        game_description: 1,
    },
});

module.exports = mongoose.model('Games', GameSchema);
module.exports = mongoose.model('GameImages', GameImageSchema);
module.exports = mongoose.model('Users', UserSchema);