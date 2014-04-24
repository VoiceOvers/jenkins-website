var app = require('../app'),
    co = require('co'),
    _ = require('lodash');

var io = app.servers.socketio.getServer();
var clients;


//The system has been changed on the website.
function *_systemComponentPUT(data) {
  if(!data || !data.system || !data.component || !data.zone) {
    throw new Error('Missing Input Parameters on System Change.');
  }

  //Query system from database.
  var system = yield app.models.System.findById(data.system._id)
    .exec();

  var zone = system.zones.id(data.zone._id);
  var component = zone.components.id(data.component._id);

  component.name = data.component.name;
  component.status = data.component.status;
  component.zigbee = data.component.zigbee;

  //Save system state
  system = yield system.save();

  //Send call for master module update.

  return system;
}

//Retrieve a system from the database.
function *_systemStateGet(data) {
  //Validate Input
  if(!data || !data.type) {
    throw new Error('Missing Input Parameters on System Query.');
  }

  var system;
  if(data.type === 'User') { //Find System by user Id

    //Validate Id
    var userId = data.user._id;
    if(!userId) {
      throw new Error('Missing User Id For Query System.');
    }

    //Query our systems from the Database.
    system = yield [
      app.models.System.find({})
        .where('access.owner').equals(userId)
        .select('_id access flags zones')
        .lean()
        .exec(),
      app.models.System.find({})
        .where('access.users').in([ userId ])
        .select('_id access flags zones')
        .lean()
        .exec() ];


    system = _.flatten(system);

  } else if(data.type === 'System') {

    //Validate Id
    var systemId = data.system._id;
    if(!systemId) {
      throw new Error('Missing System Id For Query System.');
    }

    //Query our system from the database.
    system = yield app.models.System.findById(systemId)
      .lean()
      .exec();
  } else {
    throw new Error('Unknown Query Type For System.');
  }

  return system;
}

//Wrap the try/catch on the event.
function wrapEvent(fn, data, socket, emitEvent) {
  co(function *() {
    try {
      var obj = yield fn(data);
    } catch (e) {
      console.log(e);
      socket.emit('error', e);
    }

    if(socket && emitEvent) {
      socket.emit(emitEvent, obj);
    }
  })();
}

/*
  Register the socket to receive and emit events to connected clients
  from the website/phone application.

  Received Events:
  system:state:{change, get}
  user:{auth, forgot, get, register, put}


  Emitted Events:
  system:state:{status}
  user:{get}

 */
exports.impl = {};
exports.impl.register = function (socket) {
  socket.on('system:component:put', function (data, cb) {
    wrapEvent(_systemComponentPUT, data, socket, 'system:state:status');
  });

  socket.on('system:state:get', function (data, cb) {
    wrapEvent(_systemStateGet, data, socket, 'system:state:status');
  });
};