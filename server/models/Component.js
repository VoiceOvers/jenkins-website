/*
 * server/models/User.js
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
  access: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
  flags: [{type: String, default: []}],
  zones: [{type: mongoose.Schema.ObjectId, ref: 'Zone'}],
  socket: {
    mostRecentCommunication: {type: Date, default: Date.now()},
  }
});

schema.plugin(mongooseTimestamp);

// Model
var model = mongoose.model('Component', schema);

// Public API
exports = module.exports = model;