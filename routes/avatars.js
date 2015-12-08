'use strict';
// dependencies
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

// load avatar model
var Avatar = require('../models/avatar');

// every request to this controller must pass through this 'use' functions
// copy and pasted from method-override
router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));
// ==================================================================
// /avatars routes ==================================================
// ==================================================================
// get all avatars (route to '/avatars')
router.route('/')
    .get(function (req, res) {
        // get all avatars from mongodb
        mongoose.model('Avatar').find({}, null, function (err, avatars) {
            if (err) {
                console.log('GET Error: No Avatars were found' + err);
            } else {
                res.render('avatars/index', {title: 'All Avatars', 'avatars': avatars});
            }
        })
    });

// route middleware to validate :id
// copy pasted from the project express-node-mongo-skeleton by Kanitkorn Sujautra
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Avatar').findById(id, function (err, avatar) {
        //if it isn't found, we are going to respond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404);
        }
        else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(avatar);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});

// shows the requested avatar (currently not in use)
router.route('/:id')
    .get(function(req, res) {
        mongoose.model('Avatar').findById(req.id, function (err, avatar) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            }
            else {
                console.log('GET Retrieving AvatarID: ' + avatar._id);
                res.render('avatars/show', {
                    'avatar' : avatar
                });

            }
        });
    });

router.route('/:id/edit')
    //GET the individual avatar by its mongoose.objectID
    .get(function(req, res) {
        //search for the avatar within Mongo
        mongoose.model('Avatar').findById(req.id, function (err, avatar) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {
                //Return the avatar
                console.log('GET Retrieving AvatarID: ' + avatar._id);
                res.render('avatars/edit', {
                    'avatar' : avatar,
                    maxSkins : avatar.maxSkins(avatar)
                });
            }
        });
    })
    //PUT to update avatar by ID
    .put(function(req, res) {
        // Get our REST or form values. These rely on the "name" attributes
        var newName = req.body.name;
        var newHead = req.body.head;
        var newBody = req.body.body;
        var newTail = req.body.tail;

        //find the document by ID
        mongoose.model('Avatar').findById(req.id, function (err, avatar) {
            //update it
            avatar.update({
                name : newName,
                head : newHead,
                body : newBody,
                tail : newTail
            }, function (err) {
                if (err) {
                    req.flash('error', 'There was a problem updating the information to the database.');
                }
                else {
                    res.redirect('/profile');
                }
            })
        });
    })
    //DELETE avatar by ID
    .delete(function (req, res) {
        //find avatar by ID
        mongoose.model('Avatar').findById(req.id, function (err, avatar) {
            if (err) {
                return console.error(err);
            } else {
                //remove it from Mongo
                avatar.remove(function (err, avatar) {
                    if (err) {
                        return console.error(err);
                    } else {
                        //Returning success messages saying it was deleted
                        console.log('DELETE removing ID: ' + avatar._id);
                        res.redirect('/profile')
                    }
                });
            }
        });
    });

module.exports = router;