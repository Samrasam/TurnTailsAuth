'use strict';
// dependencies
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');

var Avatar = require('../models/avatar');

// standard passport function
var ensureAuthenticated = function (req, res, next) {
  // route middleware to ensure that only authenticated users can log in
  if (req.isAuthenticated()) {
      return next();
  }
    else {
      console.log('Unable to authenticate user.');
      // if the user is not authenticated, redirect him to the home page
      res.redirect('/');
  }
};

// function used to reset the password if forgotten
var passwordReset = function (req, res, next) {
  User.findOne({resetPasswordToken: req.params.token,
    resetPasswordExpires: {$gt: Date.now()} },
      function(err, user) {
        if(!user) {
          req.flash('error', 'Password Token is not valid or has expired.');
          return res.redirect('/forgot');
        }
        return next();
  })
};

module.exports = function (passport) {

  // index route ====================================================
  router.get('/', function (req, res) {
    res.render('index', { message: req.flash('message') });
  });

  // ================================================================
  // profile routes =================================================
  // ================================================================
  router.route('/profile')
      .get(ensureAuthenticated, function (req, res) {
        mongoose.model('Avatar').find({'user': req.user._id}, null, {}, function (err, avatars) {
      if (err) {
        console.log('Database error: ' + err);
      } else {
        res.render('users/profile', { user: req.user, 'avatars': avatars})
      }
    })
  })

      .post(function (req, res, done) {

        var newAvatar = new Avatar();

        newAvatar.name = req.body.avatarName;
        newAvatar.head = 1;
        newAvatar.body = 1;
        newAvatar.tail = 1;
        // score gets randomly created to simulate a achieved highscore
        // hardcap of 400 for demonstration purposes;
        newAvatar.score = Math.floor(Math.random() * 400);
        newAvatar.user = req.user._id;

        // save the user
        newAvatar.save(function (err) {
          if (err) {
            console.log('Saving Error: ' + err);
            throw err;
          }
          //console.log('POST created new avatar: ' + newAvatar);
          return done(null, newAvatar);
        });
        res.redirect('/profile');
      });

  // logout => redirect to home page
  router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // login ==========================================================
  router.route('/login')
      .post(passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/',
        failureFlash: true
      }));

  // signup ==========================================================
  router.route('/signup')
      .get(function (req, res) {
        res.render('users/signup', { message: req.flash('message'), title: "Register" })
      })
      .post(passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
      }));

  // forgot password ================================================
  router.route('/forgot')
      .get(function(req, res) {
        res.render('users/forgot', {message: req.flash('message') })
      })

      .post(passport.authenticate('local-forgot', {
        successRedirect: '/reset/:token',
        failureRedirect: '/forgot',
        failureFlash: true
      }));

  router.get('/reset/:token', passwordReset, function(req, res) {
    res.render('users/reset', {user: req.user})
  });

  return router;

};
