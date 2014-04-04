var app = require('../../server/app');
var helper = require('./../helper');

var cleanup = helper.cleanup,
    should = require('should'),
    training = helper.mocks.training,
    user = helper.mocks.user;


describe('Statistics', function () {

  it('Should Retrieve Statistics for Training', function *(done) {
    try {
      var results = yield app.controllers.statistics.impl.trainingStats(training._id, {_id: user._id});
      results.should.have.property('nonStructuredAverages');
      results.should.have.property('structuredAverages');
      done();
    } catch (e) {
      should.not.exist(e);
    }
  });
});
