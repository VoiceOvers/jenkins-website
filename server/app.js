/*
 * nodemon --watch server --harmony-generators server
 *
 * server/app.js
 */

'use strict';

var path = require('path');
var http = require('http');

var _ = require('lodash');
var requireDir = require('require-dir');

var koa = require('koa');

//Find out which environment we are preparing for.
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require(path.join(path.normalize(__dirname + '/../config'), process.env.NODE_ENV));

// Create an app
var app = {
  config: config,
  dir: __dirname,
  lib: {},
  project: require('../project'),
  routes: require('./routes'),
  servers: {
    http: {
      httpServer: null,
      getServer: function () {
        return this.httpServer;
      }
    },
    koa: {
      koaServer: null,
      getServer: function () {
        return this.koaServer;
      }
    }
  }
};

exports = module.exports = app;

//Make the models and such available.
app.lib = requireDir(app.dir + '/lib');
app.lib.passport = require('koa-passport');
app.models = requireDir(app.dir + '/models');
app.controllers = requireDir(app.dir + '/controllers');


// Defaults for config
_.defaults(app.config, {
  url: app.config.url || 'http://localhost:' + app.project.server.port
});

//Attach All project specific middleware here.
app.attachMiddleware = function() {
  // Passport
  app.lib.local.attach(app);
  // app.lib.facebook.attach(app);
  // app.lib.google.attach(app);
  // app.lib.twitter.attach(app);
  //
  app.servers.koa.getServer().use(function *(next) {
    if(!this.req.user) {
      this.cookies.set('user._id', null);
      this.cookies.set('user.name.full', null);
    } else  {
      this.cookies.set('user._id', this.req.user._id, {overwrite: true, signed: false, httpOnly: false});
      this.cookies.set('user.name.full', this.req.user.name.full, {overwrite: true, signed: false, httpOnly: false});
    }
    yield next;
  });
};

// Run app.servers
app.run = function () {
  // Connect to DB
  app.lib.mongooseconnect.connect(app.config.db.mongo);
  // app.lib.redisConnect.connect(app.config.db.redis);

  //KOA server
  app.servers.koa.koaServer = koa();
  app.lib.middlewares.attachMiddleware(app);

  //HTTP Server
  var port = process.env.PORT || app.project.server.port || 3000;
  app.servers.http.httpServer = http.createServer(app.servers.koa.getServer().callback()).listen(port);

    //Register our routes
  app.routes.register(app);

  return app.servers.http.getServer();
};