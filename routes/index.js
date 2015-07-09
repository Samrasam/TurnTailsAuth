'use strict';
var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
  // route middleware to ensure that only authenticated users can log in
  if (req.isAuthenticated()) {
    return next;
  }
  // if the user is not authenticated, redirect him to the home page
  res.redirect('/');
};

module.exports = function (passport) {

  // home page
  router.get('/', function (req, res) {
    res.render('index', { message: req.flash('message') });
  });

  // profile page
  router.get('/profile', isAuthenticated, function (req, res) {
    res.render('profile', { message: req.flash('message') })
  });

  // logout => redirect to home page
  router.get('/logut', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // login ==========================================================
  router.post('/login', passport.authenticate('local-login', {
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
