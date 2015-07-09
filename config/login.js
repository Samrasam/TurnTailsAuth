'use strict';
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport) {

    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
    };

    // ==================================================================
    // local login ======================================================
    // ==================================================================
    passport.use('local-login', new LocalStrategy({
        // this allows to pass in the req from the route
        passReqToCallback: true
    },

        //
        function (req, username, password, done) {
            // check in mongo if user already exists or not
            User.findOne({'username': username},
                function (err, user) {
                    // if there is an error, return the error first
                    if (err) {
                        return done(err);
                    }
                    // if the username does not exist, log the error and redirect back
                    if (!user) {
                        console.log('User not found with username: ' + username);
                        return done(null, false, req.flash('message', 'User not found.'));
                    }
                    if (!isValidPassword(user, password)) {
                        console.log('Invalid Password');
                        // redirect back to login page
                        return done(null, false, req.flash('message', 'Invalid Password'));
                    }
                    // if everything goes well, return the user
                    return done(null, user);
                });
        }));
};
