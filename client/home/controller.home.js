/*
 * client/home/controller.home.js
 */

module.exports = function ($scope, socket, user) {

  //Initialize scope variables to avoid use of ng-cloak
  $scope.alerts = [];
  $scope.system = {};

  function refreshSystem () {
    //Ask Cloud Server to send Status of System.
    console.log(Date.now());
    socket.emit('client:system:state:get', {type: 'User', user: user});
  }

  socket.on('error', function (data) {
    console.log(data);
  });

  //Event for Cloud Server to send Current Status of System.
  socket.on('client:system:state:status', function (data) {
    console.log(Date.now());
    if(data.length) {
      $scope.system = data;
      $scope.system = $scope.system[0];
    }
  });

  $scope.toggleAlert = function (message, error) {
    $scope.alerts.length = 0; //Clear prior alerts
    $scope.alerts.push({message: message, type: error ? 'danger' : 'success'});
  };

  $scope.toggleComponent = function (component, zone) {
    //Emit a socket event to Cloud Server, telling it a component here has been changed.
    socket.emit('client:system:component:put', {component: component, system: $scope.system, zone: zone});
  };

  //Initialize on first state load.
  refreshSystem();
};
