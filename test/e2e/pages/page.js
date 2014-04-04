var co = require('co');
var protractor = require('protractor/lib/protractor.js');
var helper = require('./../../helper');

function Page(url) {
  this.baseUrl = 'http://localhost:3000/';
  this.pagePath = url;
  this.ptor = helper.ptor;
}

Page.prototype.angularWait = function *() {
  yield this.ptor.waitForAngular();
}

Page.prototype.open = function *() {
  yield this.ptor.get(this.url());
};

Page.prototype.url = function () {
  return this.baseUrl + '#!/' + this.pagePath;
}

Page.prototype.wait = function (ms) {
  return function (done) {
    setTimeout(done, ms);
  };
};

module.exports = Page;