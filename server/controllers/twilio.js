var app = require('../app'),
    twilio = require('twilio')('AC201fb0cd4137b6030e31b921d0077d8f', '2fa518ee00dc9c83df0d4cebe02b2c98'),
    _ = require('lodash');

exports.impl = {};

exports.impl.sendTextMessage = function *(sender, recipient, message) {
  var response;
  try {
    response = yield twilio.sendMessage({
      to: recipient,
      // from: sender,
      from: '+19858821264',
      body: message
    });
  } catch (e) {
    console.log(e);
    throw e;
  }

  console.log(response);
};