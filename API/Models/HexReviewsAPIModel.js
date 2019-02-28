'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = new Schema({
    game_title: {
        type: String,
        required: 'Kindly enter the name of the game.'
    },
    game_description: {
        type: String,
        default: 'No description has been added yet.'
    },
    game_genre: {
        type: [{
            type: String,
            enum: [
                'Action', 
                'Action-Adventure', 
                'Adventure', 
                'Role-Playing', 
                'Simulation', 
                'Strategy', 
                'Sports'
            ]
        }],
        required: 'A genre for the game is required.'
    },
    game_sub_genre_primary: {
        type: [{
            type: String,
            enum: [
                'FPS',
                'Platformer', 
                'Shooter', 
                'Fighting', 
                'Stealth', 
                'Survival', 
                'Rhythm', 
                'Survival Horror', 
                'Metroidvania', 
                'Text Adventure', 
                'Graphic Adventure', 
                'Visual Novel', 
                'Interactive Movie', 
                'Action RPG', 
                'MMORPG', 
                'MMO', 
                'RPG', 
                'Roguelike', 
                'Tactical RPG', 
                'Sandbox RPG', 
                'Choices', 
                'Fantasy', 
                'Vehicle Simulation', 
                'Life Simulation', 
                'RTS', 
                'RTT', 
                'TBS', 
                'TBT', 
                'Wargame', 
                'MOBA', 
                'Racing', 
                'Sports Game', 
                'Competitive',
                'None'
            ]
        }],
        default: ['None']
    },
    game_sub_genre_secondary: {
        type: [{
            type: String,
            enum: [
                'FPS',
                'Platformer', 
                'Shooter', 
                'Fighting', 
                'Stealth', 
                'Survival', 
                'Rhythm', 
                'Survival Horror', 
                'Metroidvania', 
                'Text Adventure', 
                'Graphic Adventure', 
                'Visual Novel', 
                'Interactive Movie', 
                'Action RPG', 
                'MMORPG', 
                'MMO', 
                'RPG', 
                'Roguelike', 
                'Tactical RPG', 
                'Sandbox RPG', 
                'Choices', 
                'Fantasy', 
                'Vehicle Simulation', 
                'Life Simulation', 
                'RTS', 
                'RTT', 
                'TBS', 
                'TBT', 
                'Wargame', 
                'MOBA', 
                'Racing', 
                'Sports Game', 
                'Competitive',
                'None'
            ]
        }],
        default: ['None']
    },
    game_developer: {
        type: String,
        default: 'No developer information has been added yet.'
    },
    game_publisher: {
        type: String,
        default: 'No publisher information has been added yet.'
    },
    game_age_rating: {
        type: [{
            type: String, 
            enum: [
                'Parental Guidance Recommended',
                'Appropriate for ages rated 3+',
                'Appropriate for ages rated 7+',
                'Appropriate for ages rated 12+',
                'Appropriate for ages rated 16+',
                'Appropriate for ages rated 18+'
            ]
        }],
        default: ['Please Select']
    },
    game_release_date: {
        type: Date,
        required: 'Please enter a release date.'
    },
    game_creation_date: {
        type: Date,
        default: Date.now
    },
    game_rating: {
        type: Number,
        default: 0.0
    }
});

module.exports = mongoose.model('Games', GameSchema);