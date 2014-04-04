exports.admin = function *(next) {
  var user = this.req.user;
  var admin = (!(user.roles.indexOf('admin') > -1) && !(user.roles.indexOf('masteradmin') > -1)) ? false : true;

  //Make sure this user is allowed to access the admin page.
  if(!user || !admin) {
    this.throw('Unauthorized Access.', 401);
  }
  yield next;
};

exports.master = function *(next) {
  var user = this.req.user;
  if(!user || !(user.roles.indexOf('masteradmin') > -1)) {
    this.throw('Unauthorized Access.', 401);
  }
  yield next;
};

exports.user = function *(next) {
  var user = this.req.user;
  if(!user) {
    this.throw('Unauthorized Access.', 401);
  }
  yield next;
};