'use strict';

var mongoose = require('mongoose');
var Schema = moongoose.Schema;

var GameSchema = new Schema({
    name: {
        type: String,
        required: 'Kindly enter the name of the game.'
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: [{
            type: String,
            enum: ['pending', 'ongoing', 'completed']
        }],
        default: ['pending']
    }
});

module.exports = mongoose.model('Games', GameSchema);