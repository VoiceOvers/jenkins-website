module.exports = function (admin, $scope, $state) {
  if(!($scope.user.roles.indexOf('masteradmin') > -1)) {
    $state.go('home');
  }

  $scope.company = {
    administration: {
      access: ''
    },
    location: {}
  };

  $scope.postCompany = function () {
    $scope.company.administration.access = [ $scope.company.administration.access ];
    admin.createCompany($scope.company)
      .then(function () {
        $scope.toggleAlert('Successfully Created Company', false);
      }, function (result) {
        $scope.toggleAlert('Error Creating Company: ' + result.data, true);
      });
  };
};