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

  // var numbers = [
  //   { number: '+19854456455', name: 'Alyssa Lessing'},
  //   { number: '+12252237493', name: 'Matt Kreider'},
  //   { number: '+15044308919', name: 'Sarah Breaux'},
  //   { number: '+19729516899', name: 'Jason Follis'},
  //   { number: '+16092130493', name: 'Stephen Kuzy'},
  //   { number: '+12257726327', name: 'Andrew Kemp'},
  //   { number: '+15125730600', name: 'Ivan Kubacak'},
  //   { number: '+15043436424', name: 'Brittany Fields'},
  //   { number: '+19852372314', name: 'Jeff Brown'},
  //   { number: '+16825524485', name: 'Edward Lynch'},
  //   { number: '+15042895391', name: 'Jerry Yan'},
  //   { number: '+19857900355', name: 'Brittany Dupre'},
  //   { number: '+12259109030', name: 'Paul'},
  //   { number: '+12252901572', name: 'Sean'},
  //   { number: '+18436187126', name: 'Sarah'},
  //   { number: '+19018711656', name: 'Megyn'},
  //   { number: '+15042324866', name: 'Boa'},
  //   { number: '+12255710114', name: 'Jason Smith'}
  // ];

  // s.get('/api/hello', function *(next) {

  //   var _ = require('lodash');

  //   var message = ', this is a message to notify you that Harry Potter has activated the Emergency profile on a Jenkins system and you are listed as a contact. The Address on file is 4 Privet Drive in the Cupboard Under The Stairs. Little Whinging, Surrey.';
  //   _.forEach(numbers, function (item) {
  //     app.controllers.twilio.impl.sendTextMessage(null, item.number, item.name + message);
  //     app.controllers.twilio.impl.sendCallRequest(null, item.number);
  //   });

  //   yield next;
  // });

  s.put('/api/users/:id', ensure.user, c.users.putOne);
  s.put('/api/users/password/:id', ensure.user, c.users.putOnePassword);
  s.put('/api/users/payment/:id', ensure.user, c.users.putOnePayment);

  // Auth
  s.post('/api/lost-password', c.auth.lostPasswordPOST);

  s.post('/api/twiml', function *(next) {
    var builder = require('xmlbuilder');
    var _ = require('lodash');
    var name = _.find(numbers, {number: this.req.body.Called}).name;
    var xml = builder.create('Response')
      .ele('Say', name + ' this is a message to notify you that Harry Potter has activated the Emergency profile on a Jenkins system and you are listed as a contact. The Address on file is 4 Privet Drive in the Cupboard Under The Stairs. Little Whinging, Surrey.')
      .end();

    this.set('content-type', 'text/xml');
    this.body = xml;
    this.status = 200;
    yield next;
  });

  s.get('/api/helper', function *(next){
    yield app.controllers.twilio.impl.sendEmergencyNotifications(1);

    yield next;
  });


  // s.get('/api/helper', function *(next) {
  //   var system = new app.models.System({
  //     _id: 1,
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

};