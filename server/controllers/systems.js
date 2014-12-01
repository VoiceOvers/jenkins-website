var app = require('../app'),
    _ = require('lodash');

exports.impl = {};

//Retrieve a system from the database.
exports.impl.systemStateGET = function *(data) {
  var system;
  switch(data.type){
    case 'User':
      //Validate Id
      var userId = data.user._id;
      if(!userId) {
        throw new Error('Missing User Id For Query System.');
      }

      //Query our systems from the Database.
      system = yield [
        app.models.System.find({})
          .where('access.owner').equals(userId)
          .select('_id access flags zones status emergency')
          .lean()
          .exec(),
        app.models.System.find({})
          .where('access.users').in([ userId ])
          .select('_id access flags zones status emergency')
          .lean()
          .exec() ];

      system = _.flatten(system);
      break;
    case 'System':
    case 'Tinkerbell':
      //Validate Id
      var systemId = data.system._id;
      if(!systemId) {
        throw new Error('Missing System Id For Query System.');
      }

      //Query our system from the database.
      system = yield app.models.System.findById(systemId)
        .lean()
        .exec();
      break;
    default: 
      throw new Error('Unknown Query Type For System.');
      break;
  }

  return system;
};

exports.impl.systemPUT = function *(data){
  if(!data){
    throw new Error('Missing Input Parameters on System PUT');
  }

  var system = yield app.models.System.findById(data.system._id).exec();

  system.emergency = data.system.emergency;

  system = yield system.save();

  return system;
};

/**
 * The system has been changed in userland, propogate changes to website land.
 *
 */
exports.impl.systemComponentPUT = function *(data, command) {

  if(!data || !data.system || !data.component || !data.zone) {
    throw new Error('Missing Input Parameters on System Change.');
  }

  // Query system from database.
  var system = yield app.models.System.findById(data.system._id)
    .exec();

  var zone = system.zones.id(data.zone._id);
  var component = zone.components.id(data.component._id);

  component.name = data.component.name;
  component.state.status = data.component.state.status;
  component.state.position = data.component.state.position;
  component.zigbee.networkId = data.component.zigbee.networkId;

  // Save system state
  system = yield system.save();

  return system;
};