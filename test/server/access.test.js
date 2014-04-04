var app = require('../../server/app'),
    helper = require('./../helper');

var  cleanup = helper.cleanup,
    should = require('should'),
    product = helper.mocks.product,
    user = helper.mocks.user;

describe('Training Access', function () {

  it('Should Grant Access to Training', function *(done) {
    try {
      var results = yield app.controllers.trainingaccess.impl.grantAccess([product], user);
      done();
    } catch (e) {
      should.not.exist(e);
    }
  });

  it('Should Fail to Grant Access by bad products input', function *(done) {
    try {
      var results = yield app.controllers.trainingaccess.impl.grantAccess(product, user);
      should.not.exist(results);
    } catch (e) {
      var temp = new Error('Array Of Products to Grant Access Empty.');
      e.should.equal.temp;
      done();
    }
  })

  it('Should Fail to Grant Access by bad user input', function *(done) {
    try {
      var results = yield app.controllers.trainingaccess.impl.grantAccess(product, {});
      should.not.exist(results);
    } catch (e) {
      var temp = new Error('Granting Access requires User Parameter.');
      e.should.equal.temp;
      done();
    }
  })
});