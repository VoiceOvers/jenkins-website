/*
 * server/socketio.js
 */

'use strict';

var sockets = require('./sockets');

var _socketio = null;
var _clients,
    _tinkerbells;

exports.registerTinkerbells = function (app) {
  // Can take this out, move up top for one construction.
  _socketio = app.servers.socketio.getServer();

  _tinkerbells = _socketio
    .of('/tinkerbells')
    .on('connection', function (socket) {
      // Attach variables.
      socket.address = socket.id + ': ' +
                       socket.handshake.address;
      socket.connectedAt = new Date();

      // Call onDisconnect.
      socket.on('disconnect', function () {
        sockets.onTinkerbellDisconnect(socket);
        console.info('[%s] DISCONNECTED', socket.address);
      });

      // Call onConnect.
      sockets.onTinkerbellConnect(socket);
      console.info('[%s] CONNECTED', socket.address);
    });
};

exports.registerClients = function (app) {
  // Can take this out, move up top
  _socketio = app.servers.socketio.getServer();

  _clients = _socketio
    .of('/clients')
    .on('connection', function (socket) {
      // Attach variables.
      socket.address = socket.id + ': ' +
                       socket.handshake.address;
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