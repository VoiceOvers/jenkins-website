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

var Zone = require('./Zone');

// Schema
var schema = new mongoose.Schema({
  access: {
    owner: {type: mongoose.Schema.ObjectId, ref: 'User'},
    users: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
  },
  flags: [{type: String, default: []}],
  name: {type: String, default: 'My Jenkins System'},
  socket: {
    mostRecentModuleCommunication: {type: Date, default: Date.now()},
  },
  zones: [ Zone.schema ]
}, {_id: true});

schema.plugin(mongooseTimestamp);

// Model
var model = mongoose.model('System', schema);

// Public API
exports = module.exports = model;