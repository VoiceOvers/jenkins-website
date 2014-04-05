var app = require('../app'),
    _ = require('lodash');

var io = app.sockets.server;
var systems;

function handle(socket) {
  //Store socket on redis
  //Handle incoming updates
  socket.on('state', function (data, cb) {
    //Handle Data change by saving to db
    //Relay this change to front end.
  });
}

exports.impl = {};
//Get our System sockets stream going.
exports.impl.startSystemService = function () {
  systems = io
    .of('/systems')
    .on('connection', function (socket) {
      handle(socket);
    });
};

exports.impl.relaySystemCommand = function () {
  //Data will be sent in from clients server.
};

