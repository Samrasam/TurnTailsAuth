'use strict';
var express = require('express');
var router = express.Router();

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

  // home page
  router.get('/', function (req, res) {
    res.render('index', { message: req.flash('message') });
  });

  // profile page
  router.get('/profile', ensureAuthenticated, function (req, res) {
    res.render('profile', { user: req.user })
  });

  // logout => redirect to home page
  router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // login ==========================================================
  router.post('/login',
      passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/',
        failureFlash: true
      }));

  // signup ==========================================================
  router.get('/signup', function (req, res) {
    res.render('signup', { message: req.flash('message') })
  });

  router.post('/signup',
      passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
      }));

  // forgot password ================================================
  router.get('/forgot', function(req, res) {
    res.render('forgot', {message: req.flash('message') })
  });

  router.post('/forgot', passport.authenticate('local-forgot', {
    successRedirect: '/reset/:token',
    failureRedirect: '/forgot',
    failureFlash: true
  }));

  router.get('/reset/:token', passwordReset, function(req, res) {
    res.render('reset', {user: req.user})
  });

  // tests ==========================================================
  var Avatar = require('../models/avatar');

  // route to test how many avatars currently exist in the database
  router.get('/api/avatars', function (req, res) {
    Avatar.find(function (err, avatars) {
      if (err) {
        res.send(err);
      }
      res.json(avatars);
    })
  });

  // route to test if a user is logged in or not
  router.get('/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
  });
  // tests end ======================================================

  return router;

};
