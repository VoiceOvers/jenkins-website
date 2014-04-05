var app = require('../app'),
    _ = require('lodash');

var io = app.sockets.server;
var clients;

function _clientAuth (data, cb) {

}

function _stateChange(data, cb) {

}

exports.impl.register = function (socket) {
  socket.on('state:change', function (data, cb) {
    _stateChange(data, cb);
  });

  socket.on('state:info', function (data, cb) {

  })
  socket.on('auth', function (data, cb) {
    _clientAuth(data, cb);
  })
};