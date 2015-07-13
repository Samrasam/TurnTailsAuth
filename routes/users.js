'use strict';
// dependencies
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');

// load user model
var User = require('../models/user');

// references to route /users
router.route('/')
    .get(function (req, res) {
        // get all avatars from mongodb
        mongoose.model('User').find({}, null, function (err, users) {
            if (err) {
                console.log('No Users were found.');
            } else {
                res.render('users/index', {title: 'All Users', 'users': users});
            }
        })
    });

module.exports = router;