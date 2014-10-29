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

//System socket listeners
function _registerTinkerbell(socket) {
  socket.on('info', function (data) {
    _onInfo(socket, data);
  });

  require('./tinkerbells').impl.register(socket);
}

/**
 * When the system receives a connect command from a socket somewhere in user land.
 *
 * @param {Object} socket Connection to remote module.
 */
function onTinkerbellConnect(socket) {
  _registerTinkerbell(socket);
}

function onTinkerbellDisconnect(/*socket*/) {
  //TODO log to Mongo
}

// Public API
exports.onClientConnect = onClientConnect;
exports.onClientDisconnect = onClientDisconnect;
exports.onTinkerbellConnect = onTinkerbellConnect;
exports.onTinkerbellDisconnect = onTinkerbellDisconnect;
