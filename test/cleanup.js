var app = require('../server/app'),
    helper = require('./helper');

var _ = require('lodash');
var queue = [];
var user = helper.mocks.user;

exports.removeUser = function (id) {
  queue.push(app.models.User.remove({_id: id}));
};

exports.removeUserName = function (username) {
  queue.push(app.models.User.remove({email: username}));
};

exports.clean = function *() {
  try {
    yield _.map(queue, function (item) {
      return item.exec();
    });
  } catch (e) {
    console.log(e);
  }

  queue = [];
  return;
};

exports.cleanDirtyTestUser = function *(email) {
  var result = yield app.models.User.remove({'email': email}).exec();
  return;
};
