var app = require('../../server/app'),
    helper = require('./../helper');

var expect = require('chai').expect;


describe('Server: Emails', function () {
  it('Should Send A Welcome Email', function *(done) {
    var result;
    try {
      result = app.controllers.emails.impl.sendWelcome('popasquat89@gmail.com', 'Bryce');
    } catch (e) {
      console.log(e);
      expect(e).to.not.exist;
    }
    done();
  });
});