/*
 * server/routes.js
 */

'use strict';

exports.register = function (app) {

  var c = app.controllers,
      s = app.servers.koa.getServer(),
      ensure = app.lib.ensure;

  s.get('/api/tester', c.helper.tester);

  // //Admin Data
  // s.get('/api/admin/data', ensure.admin, c.admin.getAdminData);

  // //Dash Data
  // s.get('/api/dash/data', ensure.user, c.home.getDashData);

  // //Authentication
  s.post('/api/login', c.auth.loginPOST);
  s.post('/api/logout', c.auth.logoutPOST);
  s.post('/api/register', c.auth.registerPOST);

  s.post('/login', c.auth.staticLogin);
  s.post('/register', c.auth.staticRegister);

  //MODEL USER
  s.delete('/api/users/:id', ensure.master, c.users.deleteOne);

  s.get('/api/users', c.users.getAll);
  s.get('/api/users/:id', c.users.getOne);

  s.get('/api/hello', function *(next) {
    app.controllers.sendTextMessage(null, '+19852372314', 'Hey budddyyy');
  });

  s.put('/api/users/:id', ensure.user, c.users.putOne);
  s.put('/api/users/password/:id', ensure.user, c.users.putOnePassword);
  s.put('/api/users/payment/:id', ensure.user, c.users.putOnePayment);

  // Auth
  s.post('/api/lost-password', c.auth.lostPasswordPOST);

  // s.get('/api/helper', function *(next) {
  //   var system = new app.models.System({
  //     access: {
  //       owner: '535837b58975f34d908d0d96'
  //     },
  //     flags: [ 'access' ],
  //     name: 'First Revision Jenkins Series System',
  //     zones: []
  //   });

  //   system = yield system.save();
  //   system.zones.push({
  //       name: 'Upstairs Bathroom',
  //       components: [{
  //         flags: [ 'LightSwitch'],
  //         name: 'Vanity LightSwitch',
  //         zigbee: {
  //           networkId: 'ComponentNetworkID'
  //         }
  //       }]
  //       });
  //   system.save();
  //   this.status = 200;
  //   // var system = yield app.models.System.findOne({})
  //   //   .exec();



  //   // system.zones[0].name = system.zones[0].name + ' Updated';
  //   // system.save();
  // });

  //Social Networking (TODO when passport is updated)
  // s.get('/auth/facebook', c.auth.facebook);
  // s.get('/auth/facebook/callback', c.auth.facebookCallback);
  // s.get('/auth/facebook/success', c.auth.facebookSuccess);
  // s.get('/auth/google', c.auth.google);
  // s.get('/auth/google/callback', c.auth.googleCallback);
  // s.get('/auth/google/success', c.auth.googleSuccess);
  // s.get('/auth/twitter', c.auth.twitter);
  // s.get('/auth/twitter/callback', c.auth.twitterCallback);
  // s.get('/auth/twitter/success', c.auth.twitterSuccess);

  // Blacklist (404.html)
  // s.get(/^\/api(?:[\/#?].*)?$/, c.home.error404);
};