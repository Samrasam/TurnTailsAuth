'use strict';
var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    id: Number,
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firstName: String,
    lastName: String
});

var User = mongoose.model('User', UserSchema);

module.exports = User;