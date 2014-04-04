module.exports = function AccountController( $scope, userService, $state) {
  $scope.alerts = [];
  $scope.toggleAlert = function (message, error) {
    $scope.alerts.push({message: message, type: error ? 'danger' : 'success'});
  };

  $scope.register = function () {
    var newUser = {
      username: $scope.username,
      password: $scope.password,
      passwordRepeat: $scope.passwordRepeat,
      firstName: $scope.firstName,
      lastName: $scope.lastName
    };

    userService.register(newUser)
      .then(function () {
        $state.go('home');
      }, function (error) {
        $scope.toggleAlert(error.data, true);
      });
  };
};