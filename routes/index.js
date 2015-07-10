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

  return router;

};
