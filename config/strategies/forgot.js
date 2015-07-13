'use strict';
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport) {

    var generateToken = function(done) {
        var token = "token";
        done(token);
    };

    // ==================================================================
    // local forgot =====================================================
    // ==================================================================
    passport.use('local-forgot', new LocalStrategy({
        passReqToCallback: true
    },
        function (req, email, done) {
            User.findOne({email: req.user.email}, function (err, user) {
                if(!user){
                    req.flash('message', 'No account with that email adress exists.');
                    return done(err);
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // equals 1 hour

                user.save(function(err){
                    done(err, token, user);
                })
            })
        }))
};