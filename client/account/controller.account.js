
module.exports = function AccountCtrl($scope, $state, user, userService) {
  if(!user) {
    $state.go('signin');
  } else {
    $state.go('account.basic');
  }
  $scope.paymentBtnMessage = 'Update payment details';
  $scope.updatingPayment = false;
  $scope.months = [{month: 1, label: '1 - January'},
                    {month: 2, label: '2 - February'},
                    {month: 3, label: '3 - March'},
                    {month: 4, label: '4 - April'},
                    {month: 5, label: '5 - May'},
                    {month: 6, label: '6 - June'},
                    {month: 7, label: '7 - July'},
                    {month: 8, label: '8 - August'},
                    {month: 9, label: '9 - September'},
                    {month: 10, label: '10 - October'},
                    {month: 11, label: '11 - November'},
                    {month: 12, label: '12 - December'}];

  $scope.years = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];

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

  $scope.updatePayment = function () {
    if($scope.updatingPayment) {
      userService.updatePayment($scope.user)
        .then(function (result) {
          $scope.paymentBtnMessage = 'Update payment details';
          $scope.updatingPayment = false;
          $scope.user = result;
          $scope.toggleAlert('Successfully Updated Payment', false);
        }, function (error) {
          $scope.paymentBtnMessage = 'Update payment details';
          $scope.updatingPayment = false;
          $scope.toggleAlert(error.data, true);
        });
    } else {
      $scope.user.stripe.cardNum = '';
      $scope.paymentBtnMessage = 'Save';
      $scope.updatingPayment = true;
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
};