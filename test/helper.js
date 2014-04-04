var webdriver = require('selenium-webdriver');
var _ = require('lodash');
var protractor = require('protractor/lib/protractor.js');
var path = require('path');
var requireDir = require('require-dir');
var co = require('co');

var helper = {};

exports = module.exports = helper;

helper.mocks = requireDir('./mocks');
helper.pages = requireDir('./e2e/pages');
helper.cleanup = require('./cleanup');


helper.initialize = function (done) {

  co(function *() {
    var driver = new webdriver.Builder()
      .usingServer('http://localhost:4444/wd/hub')
      .withCapabilities(webdriver.Capabilities.chrome())
      .build();

    var session = yield driver.getSession();
    driver.manage().timeouts().setScriptTimeout(11000);
    driver.manage().window().setSize(1200, 800);

    helper.ptor = protractor.wrapDriver(driver);
    helper.driver = driver;

    done();
  })();
};

helper.after = function (done) {
  co(function *() {
    yield helper.driver.quit();
    done();
  })();
};

helper.before = function () {
  //test specific
};

/**
 * Stupid client tests have to load, mock out the stuff
 * they need to not through exceptions.
 */
 _ = require('lodash');

 testdata = { server: true };
 testManager = {
   controller: function() { return function() {} },
   getNode: function() { }
 };

 window = {};