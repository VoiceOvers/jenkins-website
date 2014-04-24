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

  require('./clients').impl.register(socket);
}

function onClientConnect(socket) {
  _registerClient(socket);
}

function onClientDisconnect(/*socket*/) {
  //Log to Mongo
}

function onClientMessage(socket, packet) {
  // if (packet.type === 'heartbeat') {
  //   // ...
  // }

  //TODO Log to mongo
}

//System socket listeners
function _registerTinkerbell(socket) {
  socket.on('info', function (data) {
    _onInfo(socket, data);
  });

  require('./tinkerbells').impl.register(socket);
}

function onTinkerbellConnect(socket) {
  _registerTinkerbell(socket);
}

function onTinkerbellDisconnect(/*socket*/) {
  //TODO log to Mongo
}

function onTinkerbellMessage(socket, packet) {
  // if (packet.type === 'heartbeat') {
  //   // ...
  // }

  //TODO Log to mongo
}



// Public API
exports.onClientConnect = onClientConnect;
exports.onClientDisconnect = onClientDisconnect;
exports.onClientMessage = onClientMessage;
exports.onTinkerbellConnect = onTinkerbellConnect;
exports.onTinkerbellDisconnect = onTinkerbellDisconnect;
exports.onTinkerbellMessage = onTinkerbellMessage;
