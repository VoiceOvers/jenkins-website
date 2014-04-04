'use strict';

var util = require('util');

var passport = require('koa-passport');
var LocalStrategy = require('passport-local').Strategy;

var _app = null;

/**
 * Attach local strategy.
 *
 * @private
 * @return {undefined}
 */
function _attachStrategy() {
  passport.use(new LocalStrategy(function (username, password, done) {
    var User = _app.models.User;
    User.findOne({ 'auth.local.username': username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, {
          message: util.format('Unknown user "%s"', username)
        });
      }
      user.comparePassword(password, function (err, matched) {
        if (err) { return done(err); }
        if (matched) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid password' });
        }
      });
    });
  }));
}

/**
 * Attach passport middleware.
 *
 * @param {App} app Application.
 * @return {undefined}
 */
function attach(app) {
  _app = app;
  _attachStrategy();
}

// Public API
exports.attach = attach;