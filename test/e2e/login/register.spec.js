var helper = require('../../helper');

var cleanup = helper.cleanup,
    expect = require('chai').expect,
    should = require('chai').should(),
    RegisterPage = helper.pages.register,
    user = helper.mocks.user;

describe('E2E: Register', function () {
  var register;
  var userName = 'fake@gmail.com';

  //Call this here so we have time to initialize first
  afterEach(function *() {
    yield cleanup.clean();
  });

  before(function *() {
    yield cleanup.cleanDirtyTestUser(userName);
    register = new RegisterPage();
  });

  beforeEach(function *(done) {
    yield register.open(done);
  });

  //Make sure all our elements are accounted for.
  describe('#ScopeCheck', function () {
    it('Make Sure all Elements are accounted for.', function (done) {
      expect(register.alerts).to.exist;
      expect(register.firstNameInput).to.exist;
      expect(register.lastNameInput).to.exist;
      expect(register.passwordInput).to.exist;
      expect(register.repeatedPassword).to.exist;
      expect(register.registerButton).to.exist;
      expect(register.userNameInput).to.exist;
      done();
    });
  });

  describe('#LocalRegister', function () {
    it('Should Register A New User', function *(done) {
      register.setPassword('Fake123!');
      register.setUserName(userName);
      register.setFirstLast('MOTLEY', 'CRUE');
      register.clickRegisterButton();

      //Wait for nonsense to happen.
      yield register.angularWait();

      var url = yield helper.ptor.driver.getCurrentUrl();
      expect(url).to.contain('home');

      cleanup.removeUserName(userName);
      done();
    });

    it('Should Fail to Register by Duplicate User', function *(done) {
      register.setPassword('Fake');
      register.setUserName(user.auth.local.username);
      register.setFirstLast('Motley', 'Crue');
      register.clickRegisterButton();

      yield register.angularWait();

      var alertCount = yield register.alerts.count();
      var alert = yield register.alerts.first();
      var html = yield alert.getInnerHtml(0);

      expect(html.toString()).to.contain('Error: Username Already Exists');
      expect(alertCount).to.equal(1);
      done();
    });

    it('Should Fail to Register by Invalid Params', function *(done) {
      register.setUserName(user.auth.local.username);
      register.setFirstLast('Motley', 'Crue');
      register.clickRegisterButton();

      yield register.angularWait();

      var alertCount = yield register.alerts.count();
      var alert = yield register.alerts.first();
      var html = yield alert.getInnerHtml(0);

      expect(html.toString()).to.contain('Error: Error Validating Fields');
      expect(alertCount).to.equal(1);

      done();
    });

    it('Should Fail to Register by Invalid Email', function *(done) {
      register.setPassword('Fake');
      register.setUserName('test@gmail');
      register.setFirstLast('Motley', 'Crue');
      register.clickRegisterButton();

      yield register.angularWait();

      var alertCount = yield register.alerts.count();
      var alert = yield register.alerts.first();
      var html = yield alert.getInnerHtml(0);

      expect(html.toString()).to.contain('Error: Error Validating Fields');
      expect(alertCount).to.equal(1);
      done();
    });
  });
});