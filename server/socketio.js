/*
 * server/socketio.js
 */

'use strict';

var sockets = require('./sockets');

var _socketio = null;
var _clients,
    _tinkerbells;

exports.registerTinkerbells = function (app) {
  _socketio = app.servers.socketio.getServer();

  _tinkerbells = _socketio
    .of('/tinkerbells')
    .on('connection', function (socket) {
      // Attach variables.
      socket.address = socket.id + ': ' +
                       socket.handshake.address;
      socket.connectedAt = new Date();

    // // Call onMessage.
    // (function () {
    //   var onMessage = socket.manager.transports[socket.id].onMessage;
    //   socket.manager.transports[socket.id].onMessage = function (packet) {
    //     onMessage.apply(this, arguments);
    //     sockets.onTinkerbellMessage(socket, packet);
    //   };
    // }());

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
  _socketio = app.servers.socketio.getServer();

  _clients = _socketio
    .of('/clients')
    .on('connection', function (socket) {
      // Attach variables.
      socket.address = socket.id + ': ' +
                       socket.handshake.address;
      socket.connectedAt = new Date();

      // (function () {
      //   // var onMessage = socket.manager.transports[socket.id].onMessage;
      //   console.log(socket);
      //   // socket.manager.transports[socket.id].onMessage = function (packet) {
      //   //   onMessage.apply(this, arguments);
      //   //   sockets.onClientMessage(socket, packet);
      //   // };
      // }());

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