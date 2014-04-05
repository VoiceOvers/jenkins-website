/*
 * server/sockets/index.js
 */

'use strict';

function _onInfo(socket, data) {
  console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
}

function _registerClient(socket) {
  socket.on('info', function (data) {
    _onInfo(socket, data);
  });

  require('./clients').register(socket);
}

function onClientConnect(socket) {
  _registerClient(socket);
}

function onClientDisconnect(/*socket*/) {
  //...
}

//System socket listeners
function _registerSystem(socket) {
  socket.on('info', function (data) {
    _onInfo(socket, data);
  });

  require('./system').register(socket);
}

function onSystemConnect(socket) {
  _registerSystem(socket);
}

function onSystemDisconnect(/*socket*/) {
  //
}

function onMessage(/*socket, packet*/) {
  // if (packet.type === 'heartbeat') {
  //   // ...
  // }
}

// Public API
exports.onClientConnect = onClientConnect;
exports.onClientDisconnect = onClientDisconnect;
exports.onSystemConnect = onSystemConnect;
exports.onSystemDisconnect = onSystemDisconnect;
exports.onMessage = onMessage;