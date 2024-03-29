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

AvatarSchema.methods.maxSkins = function (avatar) {
    // every 100 score points the player unlocks a new skin set
    if (avatar.score >= 200) {
        return (Math.floor(avatar.score / 100));
    }
    // else return min value for basic skin
    return 1;
};

var Avatar = mongoose.model('Avatar', AvatarSchema);

module.exports = Avatar;