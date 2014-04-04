var app = require('../../server/app'),
    helper = require('./../helper');

var  cleanup = helper.cleanup,
    should = require('should'),
    user = helper.mocks.user,
    _ = require('lodash');

before(function *(done) {
  require('./../../server/lib/mongooseConnect').connect(app.config.db.mongo, done);
});

after(function *(done) {
  yield cleanup.clean();
  done();
});

describe('User', function () {

  before(function *(done) {
    yield cleanup.cleanDirtyTestUser('faker@gmail.com');
  });

  describe('#register()', function () {
    it('Should create user.', function *(done) {
      try {
        var result = yield app.controllers.auth.impl.registerPOST('faker@gmail.com', 'Bill', 'FANDANGO', 'Fake123!');
        result.should.have.property('_id');
        cleanup.removeUser(result._id);
      } catch (e) {
        should.not.exist(e);
      }
    });

    it('Fail to create new user by duplicate email.', function *(done) {
      try {
        var result = yield app.controllers.auth.impl.registerPOST(user.email, user.name.first, user.name.last, user.auth.local.password);
        should.not.exist(result);
      } catch (e) {
        var temp = new Error('Username Already Exists')
        e.should.equal.temp;
        done();
      }
    });
  });

  it('Fail to create by invalid params', function *(done) {
    try {
      var result = yield app.controllers.auth.impl.registerPOST(null, user.name.first, user.name.last, user.auth.local.password);
      should.not.exist(result);
    } catch (e) {
      var temp = new Error('Error Validating Fields');
      e.should.equal.temp;
      done();
    }
  });

  it('Fail to create by invalid email', function *(done) {
    try {
      var result = yield app.controllers.auth.impl.registerPOST('fakegmail.com', user.name.first, user.name.last, user.auth.local.password);
      should.not.exist(result);
    } catch (e) {
      var temp = new Error('Error Validating Fields');
      e.should.equal.temp;
      done();
    }
  });

  describe('#Password Reset', function () {
    it('Should Reset Password, Send Email', function *(done) {

      try {
        yield app.controllers.auth.impl.lostPasswordPOST(user.email);
        done();
      } catch (e) {
        should.not.exist(e);
      }
    });

    it('Fail to Reset, Non-Existent User', function *(done) {
      try {
        var result = yield app.controllers.auth.impl.lostPasswordPOST('teseter131234@gmail.com');
        should.not.exist(result);
      } catch (e) {
        var temp = new Error('No User by that email');
        e.should.equal.temp;
        done()
      }
    });

  //   it('Fail to reset, User is Social', function (done) {
  //     app.controllers.auth.impl.lostPasswordPOST('poopooface216@hotmail.com')
  //       .then(function (response) {
  //         should.not.exist(response);
  //         done(new Error('Should Fail, provided email retrieved from Social Network'));
  //       }, function (error) {
  //         should.exist(error);
  //         error.should.eql({errors: ['User was registered through Social Network.']});
  //         done();
  //       });
  //   });
  });

});


