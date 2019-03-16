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
    game_image_id: {
        type: String,
        default: ""
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
    game_image: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('Games', GameSchema);
module.exports = mongoose.model('GameImages', GameImageSchema);