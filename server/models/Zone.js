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
  created: {type: Date, default: Date.now()},
  flags: [{type: String, default: []}],
  components: [{type: mongoose.Schema.ObjectId, ref: 'Component'}],
  name: {type: String},
  system: {type: mongoose.Schema.ObjectId, ref: 'System'}
});

schema.plugin(mongooseTimestamp);

// Model
var model = mongoose.model('Zone', schema);

// Public API
exports = module.exports = model;