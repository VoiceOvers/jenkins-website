var helper = require('./../../helper'),
    Page = require('./page'),
    protractor = require('protractor/lib/protractor.js');

function RegisterPage() {
  this.ptor = helper.ptor;
  Page.call(this, 'register');

  this.alerts = this.ptor.element.all(protractor.By.repeater('alert in alerts'));
  this.firstNameInput = this.ptor.element(protractor.By.model('firstName'));
  this.lastNameInput = this.ptor.element(protractor.By.model('lastName'));
  this.passwordInput = this.ptor.element(protractor.By.model('password'));
  this.repeatedPassword = this.ptor.element(protractor.By.model('passwordRepeat'));
  this.registerButton = this.ptor.element(protractor.By.id('registerButton'));
  this.userNameInput = this.ptor.element(protractor.By.model('username'));

  this.clickRegisterButton = function () {
    this.registerButton.click();
  };

  this.setFirstLast = function (first, last) {
    this.firstNameInput.sendKeys(first);
    this.lastNameInput.sendKeys(last);
  };

  this.setPassword = function (password) {
    this.passwordInput.sendKeys(password);
    this.repeatedPassword.sendKeys(password);
  };

  this.setUserName = function (username) {
    this.userNameInput.sendKeys(username);
  };

}

  /* Setup the inheritance chain */
RegisterPage.prototype = Object.create(Page.prototype);

module.exports = RegisterPage;