var helper = require('./../../helper'),
    Page = require('./page'),
    protractor = require('protractor/lib/protractor.js');

function StoreAdminPage() {
  this.ptor = helper.ptor;
  Page.call(this, 'admin/store');

  this.alerts = this.ptor.element.all(protractor.By.repeater('alert in alerts'));


}

  /* Setup the inheritance chain */
StoreAdminPage.prototype = Object.create(Page.prototype);

module.exports = StoreAdminPage;