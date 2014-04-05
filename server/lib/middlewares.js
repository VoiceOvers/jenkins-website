/*
  This is the bootstrapped middleware, if you are adding middleware
  that is project specific, that should go in the AttachMiddleware
  method located in server/app.js
 */

'use strict';
var path = require('path');

var _ = require('lodash'),
    compress = require('koa-compress'),
    csrf = require('koa-csrf'),
    favicon = require('koa-favi'),
    logger = require('koa-log4js'),
    parse = require('co-body'),
    passport = require('koa-passport'),
    koaQs = require('koa-qs'),
    redisStore = require('koa-redis'),
    router = require('koa-router'),
    session = require('koa-sess'),
    serve = require('koa-static');

function configureBodyParser (server) {
  server.use(function *(next){
    if ('POST' !== this.method && 'PUT' !== this.method) {
      return yield next;
    }

    this.req.body = yield parse(this, { limit: '10kb' });
    yield next;
  });
}

function configurePassport (server) {
  server.use(passport.initialize());
  server.use(passport.session());
}

function configureSession (server, app) {
  var maxAge = process.env.NODE_ENV === 'development' ? null : 1000 * 60 * 60 * 24 * 30;  // 1 month
  server.use(session({
    key: app.project.name + '.sid',
    store: redisStore({
      host: app.config.db.redis.host,
      prefix: app.config.session.store.redis.prefix,
      pass: app.config.db.redis.password,
      port: app.config.db.redis.port,
    }),
    cookie: {
      maxAge: maxAge,
      signed: false,
      rewrite: true,
      httpOnly: false
    }
  }));
}

function removePoweredBy(server) {
  server.use(function *(next) {
    this.remove('X-Powered-By');
    yield next;
  });
}

function setCsrfCookie (server) {
  server.use(function *(next) {
    this.cookies.set('csrf', this.csrf, {overwrite: true, signed: false, httpOnly: false});
    yield next;
  });
}


exports.attachMiddleware = function (app) {
  var maxAge = process.env.NODE_ENV === 'development' ? null : 1000 * 60 * 60 * 24 * 30;  // 1 month
  var server = app.servers.koa.getServer();
  server.name = app.project.name;

  //Middleware Attachment
  koaQs(server); //Add Query String Support
  csrf(server); //Generate a CSRF token in this context

  configureBodyParser(server);
  removePoweredBy(server);

  //Attach Keys for our session and cookie.
  if (_.isObject(app.config.cookie) && _.isString(app.config.cookie.secret)) {
    server.keys = [ app.config.cookie.secret ];
  }
  configureSession(server, app);
  configurePassport(server);
  server.use(compress());
  setCsrfCookie(server);
  server.use(router(server));

  if (_.isFunction(app.attachMiddleware)) {
    console.log('Attaching Project Specific Middleware');
    app.attachMiddleware();
  }

  if(process.env.NODE_ENV === 'development') {
    server.use(serve(
      path.join(app.dir, '..', app.project.path.client)
    ));
    server.use(serve(
      path.join(app.dir, '..', app.project.path.client + '/app')
    ));
    server.use(logger());
    console.log(path.join(app.dir, '..', app.project.path.client));
  }

  if (process.env.NODE_ENV === 'heroku' || process.env.NODE_ENV === 'production') {
    server.use(serve(
      path.join(app.dir, '..', app.project.path.client),
      { maxAge: maxAge }
    ));

    server.on('error', function (err) {
      console.log(err.stack);
      this.throw(500, err);
    });
  }
};