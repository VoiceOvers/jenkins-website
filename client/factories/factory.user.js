module.exports = function ( $cookies, $q, $http) {

  function forgot(username) {
    return $http.post('/api/lost-password', {email: username});
  }

  function get() {
    var deferred = $q.defer();
    if(!output._id) {
      return deferred.reject('USER_NOT_FOUND');
    }

    $http.get('/api/users/' + output._id)
      .then(function (user) {
        user.isAdmin = user.roles.indexOf('admin') > -1;
        deferred.resolve(user);
      }, deferred.reject);

    return deferred.promise;
  }

  function logout() {
    return $http.post('/api/logout', {body: 'noop'});
  }

  function login(username, password) {
    var deferred = $q.defer();

    $http.post('/api/login', { _csrf: output.csrf, username: username, password: password })
      .then(function (result) {
        output._id = result._id;
        output.name = result.name;
        deferred.resolve();
      }, deferred.reject);

    return deferred.promise;
  }

  function register(user) {
    var deferred = $q.defer();
    user._csrf = output.csrf;

    $http.post('/api/register', user)
      .then(function (result) {
        output.name = result.name;
        output._id = result._id;
        deferred.resolve();
      }, deferred.reject);

    return deferred.promise;
  }

  function update (user) {
    return $http.put('/api/users/' + user._id, user);
  }

  function updatePassword(user, password) {
    return $http.put('/api/users/password/' + user._id, {password: password});
  }

  var output = {
    _id: $cookies['user._id'],
    name: $cookies['user.name.full'],
    csrf: $cookies.csrf,
    get: get,
    forgot: forgot,
    logout: logout,
    login: login,
    register: register,
    update: update,
    updatePassword: updatePassword
  };

  return output;
};