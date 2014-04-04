var helper = require('../../helper');

var cleanup = helper.cleanup,
    expect = require('chai').expect,
    should = require('chai').should(),
    SigninPage = helper.pages.signin;
    user = helper.mocks.user;

before(function (done) {
  helper.initialize(done);
});

after(function (done) {
  helper.after(done);
});

describe('E2E: Signin', function () {
  var signin;
  //Call this here so we have time to initialize first
  before(function () {
    signin = new SigninPage();
  });

  //Call us back to the signin page each time.
  beforeEach(function *(done) {
    yield signin.open(done);
  });

  //Make sure all our elements are accounted for.
  describe('#ScopeCheck', function () {
    it('Make Sure all Elements are accounted for.', function (done) {
      done();
    });
  });

  describe('#LocalLogin', function () {

    it("Fail to log me because of bad password", function *(done) {
      signin.setPassword('WRONGPASSWORD');
      signin.setUserName(user.auth.local.username);
      signin.loginButton.click();

      yield signin.angularWait();

      //Make sure we have alerted a bad login.
      var count = yield signin.alerts.count();
      var alert = yield signin.alerts.first();
      var html = yield alert.getInnerHtml();

      expect(html.toString()).to.contain('Invalid Login Information');
      expect(count).to.equal(1);
      done();
    });

    it('Should Login to the System', function *() {
      signin.setPassword(user.auth.local.password);
      signin.setUserName(user.auth.local.username);
      signin.clickLoginButton();

      yield signin.angularWait();

      var url = yield helper.ptor.driver.getCurrentUrl();
      expect(url).to.contain('home');
    });
  });
});