'use strict';

// module dependencies
var mongoose = require('mongoose'),
    Avatar = require('../app/models/avatar');

exports.create = function(req, res) {
    var avatar = new Avatar(req.body);
    avatar.user = req.user;

    avatar.save(function(err) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(avatar);
        }
    })
};

// show current avatar
exports.read = function(req,res) {
    res.jsonp(req.avatar);
};

// delete avatar
exports.delete = function() {
    var avatar = req.avatar;

    avatar.remove(function(err) {
        if(err) {
            console.log('Saving Error: ' + err);
            throw err;
        } else {
            res.jsonp(avatar);
        }
    })
};