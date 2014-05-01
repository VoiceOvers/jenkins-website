var app = require('../app'),
    twilio = require('twilio')('AC201fb0cd4137b6030e31b921d0077d8f', '2fa518ee00dc9c83df0d4cebe02b2c98'),
    _ = require('lodash');

exports.impl = {};

exports.impl.sendTextMessage = function (sender, recipient, message) {
  twilio.sendMessage({
    to: recipient,
    // from: sender,
    from: '+19858821264',
    body: message
  }, function (err, data) {
    console.log(err);
    console.log(data);
  });
};

exports.impl.sendCallRequest = function (sender, recipient, message) {
  twilio.makeCall({
      to: recipient,
      from: '+19858821264',
      url: 'http://leeroyjenkins.herokuapp.com/api/twiml'
  }, function(err, responseData) {

      //executed when the call has been initiated.
      console.log(responseData.from); // outputs "+14506667788"

  });
};