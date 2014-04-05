module.exports = function ($scope, socket, user) {
  $scope.alerts = [];

  socket.emit('state:get', function (result) {
    if(result !== '200') {
      $scope.toggleAlert('')
    }
  });

  socket.on('state:status', function (data, cb) {

  });

  socket.on('state:change', function (data, cb) {
    console.log(data);
    cb('received');
  });
  $scope.toggleAlert = function (message, error) {
    $scope.alerts.push({message: message, type: error ? 'danger' : 'success'});
  };

};