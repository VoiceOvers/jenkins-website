/*
 * server/socketio.js
 */

'use strict';

var sockets = require('./sockets');

var _socketio = null;
var _clients,
    _systems;

exports.registerSystems = function (app) {
  _socketio = app.servers.socketio.getServer();

  _socketio.set('log level', 2);

  _systems = _socketio
    .of('/systems')
    .on('connection', function (socket) {
      // Attach variables.
      socket.address = socket.handshake.address.address + ':' +
                       socket.handshake.address.port;
      socket.connectedAt = new Date();

    // Call onMessage.
    // (function () {
    //   var onMessage = socket.manager.transports[socket.id].onMessage;
    //   socket.manager.transports[socket.id].onMessage = function (packet) {
    //     onMessage.apply(this, arguments);
    //     sockets.onMessage(socket, packet);
    //   };
    // }());

      // Call onDisconnect.
      socket.on('disconnect', function () {
        sockets.onSystemDisconnect(socket);
        console.info('[%s] DISCONNECTED', socket.address);
      });

      // Call onConnect.
      sockets.onSystemConnect(socket);
        console.info('[%s] CONNECTED', socket.address);
    });
};

exports.registerClients = function (app) {
  _socketio = app.servers.socketio.getServer();

  _socketio.set('log level', 2);

  _clients = _socketio
    .of('/clients')
    .on('connection', function (socket) {
      // Attach variables.
      socket.address = socket.handshake.address.address + ':' +
                       socket.handshake.address.port;
      socket.connectedAt = new Date();

      // Call onDisconnect.
      socket.on('disconnect', function () {
        sockets.onClientDisconnect(socket);
        console.info('[%s] DISCONNECTED', socket.address);
      });

      // Call onConnect.
      sockets.onClientConnect(socket);
      console.info('[%s] CONNECTED', socket.address);
    });
}