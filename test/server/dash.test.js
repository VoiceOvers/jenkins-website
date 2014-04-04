var app = require('../../server/app');
var helper = require('./../helper');

var  cleanup = helper.cleanup,
    should = require('should'),
    training = helper.mocks.training,
    user = helper.mocks.user,
    _ = require('lodash');


describe('Dash', function () {

  it('Should Retrieve Data for Dash', function *(done) {
    try {
      var results = yield app.controllers.home.impl.getDashData({_id: user._id});
      results.should.have.property('courses');
      done();
    } catch (e) {
      should.not.exist(e);
    }
  });
});