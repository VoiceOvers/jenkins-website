/*
 * server/models/User.js
 */

'use strict';

var util = require('util');

var _ = require('lodash');
var app = require('../app');
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');

var mongooseTypes = require('mongoose-types'),
    mongooseFindorcreate = require('mongoose-findorcreate'),
    mongooseTimestamp = require('mongoose-timestamp');

//Additional types for mongoose
mongooseTypes.loadTypes(mongoose);

// Schema
var schema = new mongoose.Schema({
  email: { type: mongoose.SchemaTypes.Email, required: true },
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true }
  },
  accessToken: { type: String },
  auth: {
    local: {
      username: { type: String },
      password: { type: String }
    },
    facebook: {
      id: { type: String },
      token: { type: String },
      profile: { type: mongoose.Schema.Types.Mixed }
    },
    google: {
      id: { type: String },
      token: { type: String },
      profile: { type: mongoose.Schema.Types.Mixed }
    },
    twitter: {
      id: { type: String },
      token: { type: String },
      profile: { type: mongoose.Schema.Types.Mixed }
    }
  },
  roles: [{ type: String, default: []}]
});

// Plugins
schema.plugin(mongooseFindorcreate);
schema.plugin(mongooseTimestamp);

// Indexes
schema.path('email').index({ unique: true });
schema.path('accessToken').index();
schema.path('auth.local.username').index({ unique: true, sparse: true });
schema.path('auth.facebook.id').index({ unique: true, sparse: true });
schema.path('auth.google.id').index({ unique: true, sparse: true });
schema.path('auth.twitter.id').index({ unique: true, sparse: true });

// Virtuals
schema.virtual('name.full').get(function () {
  return this.name.first + ' ' + this.name.last;
});

schema.virtual('name.full').set(function (name) {
  var split = name.split(' ');
  if (split.length >= 2) {
    this.name.last = split.splice(split.length - 1).join(' ');
  } else {
    this.name.last = '';
  }
  this.name.first = split.join(' ');
});

schema.virtual('isAdmin').get(function () {
  return this.roles.indexOf('admin') > -1;
});

// Bcrypt middleware
schema.pre('save', function (next) {
  var SALT_WORK_FACTOR = 10,
      user = this;

  if (!user.isModified('auth.local.password')) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) { return next(err); }

    bcrypt.hash(user.auth.local.password, salt, null, function (err, hash) {
      if (err) { return next(err); }
      user.auth.local.password = hash;
      next();
    });
  });
});

// Password verification
schema.methods.comparePassword = function (candidatePassword, cb) {
  var user = this;
  bcrypt.compare(candidatePassword, user.auth.local.password, function (err, isMatch) {
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
};

/**
 * Facebook auth
 */
schema.statics.findOrCreateFacebook = function (accessToken, refreshToken, profile, cb) {
  // console.log(profile._json);
  var data = {
    email: profile._json.email,
    name: {
      /* jshint camelcase: false */
      first: profile._json.first_name,
      last: profile._json.last_name
      /* jshint camelcase: true */
    },
    'auth.facebook': {
      id: profile.id,
      token: accessToken,
      profile: profile._json
    }
  };
  app.models.User.findOneAndUpdate({
    email: data.email
  }, _.omit(data, ['email', 'name']), function (err, user) {
    if (err) { return cb(err); }
    if (user) {
      // Updated existing account.
      return cb(null, user);
    } else {
      // Create new account.
      app.models.User.create(data, cb);
    }
  });
};

/**
 * Google auth
 */
schema.statics.findOrCreateGoogle = function (accessToken, refreshToken, profile, cb) {
  // console.log(profile._json);
  var data = {
    email: profile._json.email,
    name: {
      /* jshint camelcase: false */
      first: profile._json.given_name,
      last: profile._json.family_name
      /* jshint camelcase: true */
    },
    'auth.google': {
      id: profile.id,
      token: accessToken,
      profile: profile._json
    }
  };
  app.models.User.findOneAndUpdate({
    email: data.email
  }, _.omit(data, ['email', 'name']), function (err, user) {
    if (err) { return cb(err); }
    if (user) {
      // Updated existing account.
      return cb(null, user);
    } else {
      // Create new account.
      app.models.User.create(data, cb);
    }
  });
};

/**
 * Twitter auth
 *
 * Twitter API doesn't provide e-mail, therefore
 * a fake e-mail address is generated in order to
 * pass field requirement validation.
 * E-mail may be updated by other auth strategies.
 */
schema.statics.findOrCreateTwitter = function (token, tokenSecret, profile, cb) {
  // console.log(profile._json);
  var data = {
    email: util.format('fake@%s.twitter.id',
                       profile.id),
    name: {
      first: profile._json.name.split(' ').slice(0, -1).join(' '),
      last: profile._json.name.split(' ').slice(-1).join(' ')
    },
    'auth.twitter': {
      id: profile.id,
      token: token,
      profile: profile._json
    }
  };
  app.models.User.findOneAndUpdate({
    'auth.twitter.id': profile.id
  }, _.omit(data, ['email', 'name']), function (err, user) {
    if (err) { return cb(err); }
    if (user) {
      // Updated existing account.
      return cb(null, user);
    } else {
      // Create new account.
      app.models.User.create(data, cb);
    }
  });
};

//These need to be serialized better with uid framework.
app.lib.passport.serializeUser(function(user, done) {
  done(null, user.id);
});

app.lib.passport.deserializeUser(function(id, done) {
  app.models.User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Model
var model = mongoose.model('User', schema);

// Public API
exports = module.exports = model;
