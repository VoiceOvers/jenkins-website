
module.exports = function AccountCtrl($scope, $state, user, userService, socket) {
  if(!user) {
    $state.go('signin');
  } else {
    $state.go('account.basic');
  }
  $scope.newContact = {};

  function refreshSystem (){
    socket.emit('client:system:state:get', {type: 'User', user: user});
  }

  // Event for Cloud Server to send Current Status of System.
  socket.on('client:system:state:status', function (data) {
    if(data.length) {
      $scope.system = data[0];
    }
  });

  socket.on('client:system:cb', function (){
    $scope.toggleAlert('Success!', false);
  });

  $scope.user = user;
  $scope.logoutUser = function () {
    userService.logout()
      .then(function () {
        $state.go('signin');
      }, function (error) {
        $scope.toggleAlert('Error Logging Out ' + error, true);
      });
  };

  $scope.toggleAlert = function (message, error) {
    $scope.message = message;
    $scope.errorFlag = error;
  };

  $scope.addContact = function () {
    console.log($scope.newContact)
    $scope.system.emergency.numbers.push($scope.newContact.number);
    socket.emit('client:system:put', {system: $scope.system, user: $scope.user});
    $scope.newContact = '';
  };

  $scope.updatePassword = function () {
    if($scope.newPassword === $scope.confirmPassword) {
      userService.updatePassword($scope.user, $scope.newPassword)
        .then(function () {
          $scope.toggleAlert('Password Successfully Saved.', false);
          $scope.editPassword = false;
        }, function (error) {
          $scope.toggleAlert(error.data, true);
        });
    } else {
      $scope.toggleAlert('Passwords Do Not Match', true);
    }
  };

  $scope.updateUser = function () {
    userService.update($scope.user)
      .then(function (result) {
        $scope.user = result;
      }, function (error) {
        $scope.toggleAlert(error.data, true);
      });
  };

  refreshSystem();
};