'use strict';
var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    id: Number,
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true},
    firstName: String,
    lastName: String
});

UserSchema.methods.generateHash = function(password) {
    return bCrypt.hashSync(password, genSaltSync(10), null);
};

UserSchema.methods.validPassword = function(password) {
    return bCrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', UserSchema);

module.exports = User;

// Initial seed data
/*
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
*/

/* :TODO
 * default Highscore
 * Avatar
 *  - Head
 *  - Body
 *  - Tail
 *
 */