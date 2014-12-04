var app = require('../app'),
    co = require('co'),
    _ = require('lodash');

//Wrap the try/catch on the event.
function wrapEvent(fn, data, socket, emitEvent) {
  co(function *() {
    try {
      var obj = yield fn(data);
    } catch (e) {
      // TODO (BRYCE) Take this out for live.
      console.log(e);
      socket.emit('error', e.toString());
    }

    if(socket && emitEvent) {
      socket.emit(emitEvent, obj);
    }
  })();
}

exports.impl = {};
/*
  Register the socket to receive and emit events to connected clients
  from the website/phone application.

  Received Events:
  tinkerbell:system:state:{put, get}


  Emitted Events:
  tinkerbell:system:state:{status}

 */
exports.impl.register = function (socket) {
  // Start by getting status
  socket.emit('tinkerbell:system:state:get');

  // The system in userland has had one of its component's states change from voice command / manual
  socket.on('tinkerbell:system:component:put', function (data, cb) {
    data.type = 'Tinkerbell';
    
    co(function *(){
      var system = yield app.controllers.systems.impl.systemComponentPut(data);

      var socketio = app.servers.socketio.getServer();

      // console.log(socketio);
    })();
  });

  // The system in userland is telling us the status of all its components.
  socket.on('tinkerbell:system:state:status', function (data, cb){
    socket.systemId = data.system._id; // Set id so we can query from all sockets.

    // console.log(socket.systemId);
    // Set the database to reflect the module.
  });

  // The system in userland has received an emergency phrase, find profile and activate.
  socket.on('tinkerbell:system:state:emergency', function (data) {
    co(function *(){
      var result = yield app.controllers.twilio.sendTextMessage(socket.systemId);
    })();
  });
};

exports.impl.modulePUT = function (system){
  var socketio = app.servers.socketio.getServer();

  var moduleSocket = _.find(socketio['nsps']['/tinkerbells']['sockets'], {connected: true, systemId: system._id});
  // If that module exists, lets go ahead and emit the update.
  if (moduleSocket) {
    moduleSocket.emit('tinkerbell:system:state:put', system);
  }
  
  // If we can't find the module, there is a problem since it should up 100%, send back a message that it failed.
};
