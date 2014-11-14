/*
 * server/models/Profile.js
 */

'use strict';

var app = require('../app');
var mongoose = require('mongoose');

var mongooseTypes = require('mongoose-types'),
    mongooseTimestamp = require('mongoose-timestamp');

//Additional types for mongoose
mongooseTypes.loadTypes(mongoose);

// Schema
var schema = new mongoose.Schema({
  components: [{type: mongoose.Schema.ObjectId, ref: 'Profile'}],
});

schema.plugin(mongooseTimestamp);

// Public API
exports = module.exports = mongoose.model('Profile', schema);