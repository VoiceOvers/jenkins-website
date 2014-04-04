var app = require('../app'),
    _ = require('lodash');

exports.impl = {};

exports.impl.getAdminData = function *(user) {

  var data;
  return data;
};

exports.getAdminData = function *(next) {
  var data;
  try {
    data = yield exports.impl.getAdminData(this.req.user);
    this.body = data;
  } catch (e) {
    console.log(e);
    this.throw(500, e);
  }

  yield next;
};