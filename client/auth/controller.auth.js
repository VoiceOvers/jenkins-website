module.exports = function AuthController( $scope, $state, userService ) {
  $scope.alerts = [];

  $scope.login = function login() {
    userService.login($scope.username, $scope.password)
      .then(function () {
        $scope.toggleAlert('Login Successful.', false);
        $state.go('home');
      }, function (error) {
        console.log(error);
        $scope.toggleAlert(error.data, true);
      });
  };

  $scope.forgotPassword = function (username) {
    userService.forgot(username)
      .then(function () {
        $scope.toggleAlert('Sent Email with Password Reset Information.', false);
        $scope.isForgot = false;
      }, function (error) {
        $scope.toggleAlert(error.data, true);
      });
  };

  $scope.toggleAlert = function (message, error) {
    $scope.alerts.length = 0;
    $scope.alerts.push({type: error ? 'danger' : 'success', message: message});
  };
};