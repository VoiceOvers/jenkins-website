/*
 * server/models/HistoryLog.js
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
  description: {type: String, required: true}, //Describe what happened.
  flags: [{type: String, default: []}],
  meta: { type: mongoose.Schema.Types.Mixed }, //Meta Data on connection and type
  trigger: {type: String, enum: ['Tinkerbell', 'Website', 'Phone Application'], required: true} //What did this come from.
});

schema.plugin(mongooseTimestamp);

// Public API
exports = module.exports = mongoose.model('History', schema);
