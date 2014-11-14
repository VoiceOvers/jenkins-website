var app = require('../app'),
    co = require('co'),
    tinkerbells = require('./tinkerbells'),
    _ = require('lodash');

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
  client:system:state:{put, get}


  Emitted Events:
  client:system:state:{status}

 */
exports.impl = {};
exports.impl.register = function (socket) {
  socket.emit('client:system:state:probe');

  socket.on('client:system:component:put', function (data, cb) {

    co(function *(){
      var system = yield app.controllers.systems.impl.systemComponentPUT(data);

      tinkerbells.impl.modulePUT(system);
    })();
  });

  socket.on('client:system:put', function (data){
    wrapEvent(app.controllers.systems.impl.systemPUT, data, socket, 'client:system:cb');
  })

  socket.on('client:system:state:get', function (data, cb) {
    // Give the socket an identifier
    socket.userId = data.user._id;

    wrapEvent(app.controllers.systems.impl.systemStateGET, data, socket, 'client:system:state:status');
  });
};

exports.impl.clientPUT = function (system){
  var socketio = app.servers.socketio.getServer();

  var clientSocket = _.find(socketio['nsps']['/tinkerbells']['sockets'], {connected: true, systemId: system._id});
  clientSocket.emit('tinkerbell:system:state:put', system);
};