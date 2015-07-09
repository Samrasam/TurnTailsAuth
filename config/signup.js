'use strict';
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

// Generate a salt.
var salt = bCrypt.genSaltSync(10);

module.exports = function (passport) {

    // generate hash using bCrypt
    var createHash = function (password) {
        return bCrypt.hashSync(password, salt)
    };

    // ==================================================================
    // local signup =====================================================
    // ==================================================================
    passport.use('local-signup', new LocalStrategy({
        // allows to pass back the request to the callback
        passReqToCallback: true
    },

        function (req, username, password, done) {

            var findOrCreateUser = function () {
                // find a user in Mongo with provided username
                User.findOne({ 'username' :  username }, function (err, user) {
                    // in case of any error, return using the done method
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    // check if a user with that username already exists
                    if (user) {
                        console.log('User already exists with username: ' + username);
                        return done(null, false, req.flash('message', 'User Already Exists'));
                    }
                    // (else) if there is no user with that username create the user
                    var newUser = new User();

                    // set the user's local credentials
                    newUser.username = username;
                    newUser.password = createHash(password);
                    newUser.email = req.param('email');
                    newUser.firstName = req.param('firstName');
                    newUser.lastName = req.param('lastName');

                    // save the user
                    newUser.save(function (err) {
                        if (err) {
                            console.log('Error in Saving user: ' + err);
                            throw err;
                        }
                        console.log('User Registration successful');
                        return done(null, newUser);
                    });
                });
            };
            /* Delay the execution of findOrCreateUser and execute the method
             * in the next tick of the event loop (asynchronous) */
            process.nextTick(findOrCreateUser);
        }));

};