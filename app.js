'use strict';
// ==================================================================
// express server setup =============================================
// ==================================================================
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');

var app = express();

// ==================================================================
// database configuration ===========================================
// ==================================================================
var dbConfig = require('./config/database');
var mongoose = require('mongoose');

// connect to the database defined in ./config/database.js
mongoose.connect(dbConfig.url);

// when successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open to ' + dbConfig.url);
});

// if the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

// when the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
});

// ==================================================================
// passport configuration ===========================================
// ==================================================================
var passport = require('passport');
var session = require('express-session');
app.use(session({
  secret: 'bliblablubb',
  resave: true,
  saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// init passport
var initPassport = require('./config/passport');
initPassport(passport);

// ==================================================================
// view engine setup ================================================
// ==================================================================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// ==================================================================
// middleware configuration =========================================
// ==================================================================
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// routes ===========================================================
var routes = require('./routes/index')(passport);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers ===================================================

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
