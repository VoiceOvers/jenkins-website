var app = require('../app'),
    co = require('co'),
    _ = require('lodash');

//Wrap the try/catch on the event.
function wrapEvent(fn, data, socket, emitEvent) {
  co(function *() {
    try {
      var obj = yield fn(data);
    } catch (e) {
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
  socket.on('tinkerbell:system:component:put', function (data, cb) {
    wrapEvent(app.controllers.systems.impl.systemComponentPUT, data, socket, 'tinkerbell:system:state:status');
  });

  socket.on('tinkerbell:system:state:get', function (data, cb) {
    socket.moduleId = data.module._id;
    wrapEvent(app.controllers.systems.impl.systemStateGET, data, socket, 'tinkerbell:system:state:status');
  });

  socket.on('tinkerbell:system:state:emergency', function (data) {
    app.controllers.twilio.sendTextMessage(null, '+19852372314', 'Hey budddyyy');
  });
};

