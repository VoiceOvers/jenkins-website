var app = require('../app');
var _ = require('lodash');

exports.impl = {};
exports.impl.putOne = function *(id, data) {
  var user = yield app.models.User.findByIdAndUpdate(id, data).exec();
  return user;
};

exports.impl.putOnePassword = function *(id, data) {
  var user = yield app.models.User.findById(id).exec();
  user.auth.local.password = data;
  user.save();
  return;
}

// /api/users
exports.deleteOne = function *(next) {
  try {
    yield app.models.app.models.User.findByIdAndRemove(this.params.id).exec();
    this.status = 200;
  } catch (e) {
    this.throw(500, e);
  }
  yield next;
};

exports.getAll = function *(next) {
  this.body = yield app.models.User.find({}).exec();
  yield next;
};

exports.getOne = function *(next) {
  var user;
  try {
    user = yield app.models.User.findById(this.params.id)
      .select('name email roles accessToken auth')
      .lean()
      .exec();

    delete user.auth.local.password;
    this.body = user;
    this.status = 200;
  } catch (e) {
    this.throw(e, 500);
  }
  yield next;
};

exports.putOne = function *(next) {
  try {
    this.body = yield exports.impl.putOne(this.params.id, this.req.body);
    this.status = 200;
  } catch (e) {
    this.throw(500, {errors: [ e ]});
  }
  yield next;
};

exports.putOnePassword = function *(next) {
  try {
    yield exports.impl.putOnePassword(this.params.id, this.body.password);
    this.body = {};
    this.status = 200;
  } catch (e) {
    this.status = 500;
    this.body = {};
  }
  yield next;
};

exports.putOnePayment = function *(next) {
  var user;
  try {
    user = yield exports.impl.putOnePayment(this.params.id, this.req.body.stripe);
    this.body = user;
    this.status = 200;
  } catch (e) {
    console.log(e);
    this.body = 'Error Updating Payment Information.';
    this.status = 500;
  }
  yield next;
}