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
            // change the default local strategy, which expects username and password
            usernameField: 'email',
            passwordField: 'password',
            // this allows to pass in the req from the route
            passReqToCallback: true
    },

        //
        function (req, email, password, done) {

            if (email)
                email = email.toLowerCase();

            // asynchronous
            process.nextTick(function () {
                // check in mongo if user already exists or not
                User.findOne({'email': email},
                    function (err, user) {
                        // if there is an error, return the error first
                        if (err) {
                            return done(err);
                        }
                        // if the username does not exist, log the error and redirect back
                        if (!user) {
                            console.log('User not found with email: ' + email);
                            return done(null, false, req.flash('message', 'Email not found.'));
                        }
                        if (!isValidPassword(user, password)) {
                            console.log('Invalid Password');
                            // redirect back to login page
                            return done(null, false, req.flash('message', 'Wrong Password.'));
                        }
                        // if everything goes well, return the user
                        console.log('Login successful.');
                        return done(null, user);
                    });
            });
        }));
};
