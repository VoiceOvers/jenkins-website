/*
 * server/models/User.js
 */

'use strict';

var app = require('../app');
var mongoose = require('mongoose');

var mongooseTypes = require('mongoose-types'),
    mongooseTimestamp = require('mongoose-timestamp');

var HistorySchema = require('./History');

//Additional types for mongoose
mongooseTypes.loadTypes(mongoose);

// Schema
var schema = new mongoose.Schema({
  flags: [{type: String, default: []}], //Type of Component, Etc.
  history: [ HistorySchema.schema ],
  status: {
    active: {type: Boolean, default: true}, //Have we received updates recently.
    max: {type: Number}, //Maximum Interval Position
    min: {type: Number}, //Minimum Interval Position
    position: {type: Number}, //Current Interval Position
    state: {type: Boolean, default: false}, //Boolean to show ON/OFF status
  },
  name: {type: String, required: true}, //Name of Component
  zigbee: {
    networkId: {type: String, required: true} //Id of component in the network for ZigBee
  }
});

schema.plugin(mongooseTimestamp);

// Public API
exports = module.exports = mongoose.model('Component', schema);