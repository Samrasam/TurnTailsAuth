'use strict';
// dependencies
var LocalStrategy = require('passport-local').Strategy,
    bCrypt = require('bcrypt-nodejs');

//load user model
var User = require('../../models/user');

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
        function (req, email, password, done) {

            if (email) {
                email = email.toLowerCase();
            }

            // asynchronous
            process.nextTick(function () {
                // check in mongo if user already exists or not
                User.findOne({'email': email}, function (err, user) {
                        // if there is an error, return the error first
                        if (err) {
                            return done(err);
                        }
                        // if the username does not exist, return false and an error message
                        if (!user) {
                            console.log('User not found with email: ' + email);
                            return done(null, false, req.flash('message', 'Email not found.'));
                        }
                        // if the given password does not match with the users one, return false and an error message
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
