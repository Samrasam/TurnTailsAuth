'use strict';
// dependencies
var express = require('express'),
    router = express.Router(),
    bCrypt = require('bcrypt-nodejs'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

// load user model schema
var User = require('../models/user');

// every request to this controller must pass through this 'use' functions
// copy and pasted from method-override
router.use(bodyParser.urlencoded({extended: true}));
router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

// standard passport function
// copy pasted from passport documentation
var ensureAuthenticated = function (req, res, next) {
    // route middleware to ensure that only authenticated users can log in
    if (req.isAuthenticated()) {
        return next();
    } else {
        console.log('Unable to authenticate user.');
        // if the user is not authenticated, redirect him to the home page
        res.redirect('/');
    }
};
// ==================================================================
// /users routes ====================================================
// ==================================================================
// references to route /users (shows all registered users)
router.route('/')
    .get(function (req, res) {
        // get all users from mongodb
        mongoose.model('User').find({}, null, function (err, users) {
            if (err) {
                console.log('No Users were found.');
            } else {
                res.render('users/index', {title: 'All Users', 'users': users});
            }
        })
    });

router.route('/update')
    .get(ensureAuthenticated, function (req, res) {
        res.render('users/update', {user: req.user});
    });

router.route('/:id/update')
    // GET user by id
    .get(function (req, res) {
        mongoose.model('User').findById(req.user._id, function (err, user) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {
                console.log('GET Retrieving UserID: ' + req.user._id);
                res.render('users/update', {user: req.user});
            }
        })
    })
    // PUT updated user credentials
    .put(function (req, res) {
        // Get our REST or form values. These rely on the "name" attributes
        var newUsername = req.body.newUsername,
            oldPw = req.body.oldPw,
            newPw = req.body.newPw,
            newPwCheck = req.body.newPwCheck,
            newEmail = req.body.newEmail;

        if (bCrypt.compareSync(oldPw, req.user.password)) {
            if (newPw === newPwCheck) {
                //find user by id
                mongoose.model('User').findById(req.user.id, function (err, user) {
                    //update found user
                    req.user.update({
                        username: newUsername,
                        password: bCrypt.hashSync(newPw, bCrypt.genSaltSync(10)),
                        email: newEmail
                    }, function (err) {
                        if (err) {
                            req.flash('message', 'There was a problem updating the information to the database.');
                        } else {
                            res.redirect('/profile');
                        }
                    });
                });
            } else {
                req.flash('message', 'New passwords do not match.');
                res.render('users/update', {user: req.user, message: req.flash('message')});
            }
        } else {
            req.flash('message', 'Old Password does not match.');
            res.render('users/update', {user: req.user, message: req.flash('message')});
        }
    });

module.exports = router;