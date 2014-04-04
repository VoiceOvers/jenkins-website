var helper = require('./../../helper'),
    Page = require('./page'),
    protractor = require('protractor/lib/protractor.js');

function SigninPage() {
  this.ptor = helper.ptor;
  Page.call(this, 'signin');

  this.alerts = this.ptor.element.all(protractor.By.repeater('alert in alerts'));
  this.facebookAnchor = this.ptor.element(protractor.By.id('facebookAnchor'));
  this.googleAnchor = this.ptor.element(protractor.By.id('googleAnchor'));
  this.loginButton = this.ptor.element(protractor.By.id('loginButton'));
  this.passwordInput = this.ptor.element(protractor.By.model('password'));
  this.registerAnchor = this.ptor.element(protractor.By.id('register'));
  this.twitterAnchor = this.ptor.element(protractor.By.id('twitterAnchor'));
  this.usernameInput = this.ptor.element(protractor.By.model('username'));

  this.clickFacebookAnchor = function () {
    this.facebookAnchor.click();
  };

  this.clickGoogleAnchor = function () {
    this.googleAnchor.click();
  };

  this.clickLoginButton = function () {
    this.loginButton.click();
  };

  this.clickRegisterAnchor = function () {
    this.registerAnchor.click();
  };

  this.clickTwitterAnchor = function () {
    this.twitterAnchor.click();
  };

  this.setPassword = function (password) {
    this.passwordInput.sendKeys(password);
  };

  this.setUserName = function(name) {
    this.usernameInput.sendKeys(name);
  };


}

/* Setup the inheritance chain */
SigninPage.prototype = Object.create(Page.prototype);

module.exports = SigninPage;