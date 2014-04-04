module.exports = function AdminCtrl(admin, user, data, $scope) {
  $scope.user = user;
  $scope.alerts = [];
  $scope.refreshAdminData = function () {
    admin.getAdminData()
      .then(function (result) {
        $scope.data = data = result;
      }, function (error) {
        $scope.toggleAlert(error.data, true);
        console.log(error);
      });
  };

  $scope.toggleAlert = function (message, error) {
    $scope.alerts.length = 0;
    $scope.alerts.push({message: message, type: error ? 'danger' : 'success'});
  };
};