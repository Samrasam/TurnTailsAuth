'use strict';
var mongoose = require('mongoose');

var AvatarSchema = mongoose.Schema({
    id: Number,
    name: {
        type: String,
        default: 'MyAvatar',
        trim: true
    },
    head: Number,
    body: Number,
    tail: Number,
    score: Number,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});

var Avatar = mongoose.model('Avatar', AvatarSchema);

module.exports = Avatar;

// Initial seed data
/*
Avatar.find(function (err, avatars) {

    if (avatars.length) {
        return;
    }

    new Avatar({
        id: 1,
        head: 1,
        body: 1,
        tail: 1,
        score: 200
    }).save();
});*/
