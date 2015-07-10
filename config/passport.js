'use strict';
var login = require('./login');
var signup = require('./signup');
// load the user model
var User = require('mongoose').model('User');

module.exports = function (passport) {

    // Passport needs to be able to serialize and deserialize users
    // to support persistent login sessions

    // serializes user
    passport.serializeUser(function (user, done) {
        console.log('serializing user: ', user);
        done(null, user._id);
    });

    // deserializes user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            console.log('deserializing user:', user);
            done(err, user);
        });
    });

    // Passport Strategies setup for login and signup
    login(passport);
    signup(passport);

};