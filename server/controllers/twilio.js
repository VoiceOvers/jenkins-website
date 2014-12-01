var app = require('../app'),
    twilio = require('twilio')('AC201fb0cd4137b6030e31b921d0077d8f', '2fa518ee00dc9c83df0d4cebe02b2c98'),
    _ = require('lodash'),
    Promise = require('bluebird');

exports.impl = {};

exports.impl.sendTextMessage = function *(system) {
  if(!system._id){
    system = yield app.models.System.findById(system).exec();
  }

  var results = yield _.map(system.emergency.numbers, function (number){
    return new Promise(function(resolve, reject){
      twilio.sendMessage({
        to: number,
        // from: sender,
        from: '+19858821264',
        body: 'This is an alert from the Jenkins Emergency System. The emergency profile for your system has been activated.'
      }, function (err, data) {
        if(err) reject(err);

        resolve(data);
      });      
    });
  });

  return results;
};

exports.impl.sendCallRequest = function *(system) {
  if(!system._id){
    system = yield app.models.System.findById(system).exec();
  }

  var results = yield _.map(system.emergency.numbers, function (number){
    return new Promise(function(resolve, reject){
      twilio.makeCall({
          to: number,
          from: '+19858821264',
          url: 'http://leeroyjenkins.herokuapp.com/api/twiml'
      }, function(err, responseData) {
          if(err) reject(err);

          resolve(responseData);
      });     
    });
  });

  return results;
};

exports.impl.sendEmergencyNotifications = function *(systemId){
  var system = yield app.models.System.findById(systemId).exec();

  return yield [
    exports.impl.sendTextMessage(system),
    exports.impl.sendCallRequest(system)
  ];
};