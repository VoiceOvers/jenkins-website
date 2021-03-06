/*
 * server/models/Zone.js
 */

'use strict';

var app = require('../app');
var mongoose = require('mongoose');

var mongooseTypes = require('mongoose-types'),
    mongooseTimestamp = require('mongoose-timestamp');

//Additional types for mongoose
mongooseTypes.loadTypes(mongoose);

var Component = require('./Component'),
    HistorySchema = require('./History');

// Schema
var schema = new mongoose.Schema({
  components: [ Component.schema ],
  created: {type: Date, default: Date.now()},
  flags: [{type: String, default: []}],
  history: [ HistorySchema.schema ],
  permissions: {
    active: {type: Boolean, default: false}, //Is there access restrictions.
    access: [{type: mongoose.Schema.ObjectId, ref: 'User'}] //Users With Access
  },
  name: {type: String},
});

schema.plugin(mongooseTimestamp);

// Public API
exports = module.exports = mongoose.model('Zone', schema);