var app = require('../app');
var validator = require('validator');
var randpass = require('randpass');

exports.impl = {};

exports.impl.registerPOST = function *(username, firstName, lastName, password) {
  if(!username || !validator.isEmail(username) || !firstName || !lastName || !password) {
    throw new Error('Error Validating Fields');
  }

  var user = yield app.models.User.findOne({'email': username}).exec();

  if(user) {
    throw new Error('Username Already Exists');
  }

  var fields = {
    'email': username,
    'name.first': firstName,
    'name.last': lastName,
    'auth.local.username': username,
    'auth.local.password': password
  };

  user = yield app.models.User.create(fields);
  return user;
};

exports.impl.lostPasswordPOST = function *(username) {
  var newPassword = randpass({length: 12, symbols: false});

  var user = yield app.models.User.findOne({})
    .where('email').equals(username)
    .exec();

  if(!user) {
    throw new Error('No User by that email');
  }

  user.auth.local.password = newPassword;
  user.save();

  //Send Password Reset Email

};

exports.staticRegister = function *() {
  try {

    console.log(this.req.body.username);
    console.log(this.req.body.firstName);
    console.log(this.req.body.lastName);
    console.log(this.req.body.password);

    var user = yield exports.impl.registerPOST(
      this.req.body.username,
      this.req.body.firstName,
      this.req.body.lastName,
      this.req.body.password);

    app.controllers.emails.impl.sendWelcome(
      this.req.body.username,
      this.req.body.firstName + ' ' + this.req.body.lastName);

    yield app.lib.passport.authenticate('local', {
      badRequestMessage: 'Invalid input'
    });

    var temp = {
      _id: user._id,
      name: user.name.full
    };

    this.redirect('/app/#!/home');
  } catch (e) {
    console.log(e);
    this.redirect('/app/#!/register');
  }
};

exports.loginPOST = function *(next) {

// Authentication
  try {
    yield app.lib.passport.authenticate('local', {
      badRequestMessage: 'Invalid input'
    });

    this.body = {
      _id: this.req.user._id,
      name: this.req.user.name.full
    };

    this.status = 200;
  } catch (e) {
    console.log(e);
    this.status = 500;
    this.body = 'Invalid Login Information';
  }
  yield next;
};

exports.logoutPOST = function *(next) {
  this.session = null;
  this.cookies.set('user._id', null, {overwrite: true, signed: false});
  this.cookies.set('user.name.full', null, {overwrite: true, signed: false});
  this.status = 200;
  this.body = {};
  yield next;
};

exports.lostPasswordPOST = function *(next) {
  try {
    yield exports.impl.lostPasswordPOST(this.req.body.username);
    this.body = 'Successfully Reset Password';
    this.status = 200;
  } catch (e) {
    console.log(e);
    this.body = 'Error Resetting Password';
    this.status = 500;
  }
  yield next;
};

exports.registerPOST = function * (next) {

  try {

    var user = yield exports.impl.registerPOST(
      this.req.body.username,
      this.req.body.firstName,
      this.req.body.lastName,
      this.req.body.password);

    app.controllers.emails.impl.sendWelcome(
      this.req.body.username,
      this.req.body.firstName + ' ' + this.req.body.lastName);

    yield app.lib.passport.authenticate('local', {
      badRequestMessage: 'Invalid input'
    });

    var temp = {
      _id: user._id,
      name: user.name.full
    };

    this.body = {
      data: temp,
      errors: null
    };
    this.status = 200;
    yield next;
  } catch (e) {
    this.body = e.toString();
    this.status = 500;
    // this.throw(500, e);
  }
};
