'use strict';
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    id: Number,
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String
});

var User = mongoose.model('User', userSchema);

// Initial seed data
User.find(function (err, users) {

    if (users.length) {
        return;
    }

    new User({
        id: 1,
        username: 'test',
        password: '$2a$10$/ZclOMJrtWIiwW9dumsFtedpJ/eQlzjxRP/JmDbq2dVwYEhEGbhqi', // password 'test' with correct hash
        email: 'test@test.de',
        firstName: 'test',
        lastName: 'test'
    }).save();
});

module.exports = User;

/* :TODO
 * default Highscore
 * Avatar
 *  - Head
 *  - Body
 *  - Tail
 *
 */