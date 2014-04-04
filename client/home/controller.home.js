module.exports = function ($scope, data) {
  $scope.alerts = [];

  var rowCounter = 0;
  var currentGroup = { items: [] };
  $scope.groups = [currentGroup];
  $scope.cssMaps = {
    wrapper: ['bg-alizarin', 'bg-sun-flower', 'bg-peter-river', 'bg-turquoise'],
    links: ['color-pomegranate', 'color-orange', 'color-belize-hole', 'color-green-sea']
  };

  _.each(data.courses, function (course, index) {
    if (rowCounter++ > 3) {
      rowCounter = 1;
      currentGroup = { items: [] };
      $scope.groups.push(currentGroup);
    }

    currentGroup.items.push(course);
    course.type = rowCounter - 1;
    course.pid = index;
  });

  $scope.structuredExercise = function () {

  };

  $scope.nonStructuredExercise = function () {

  };

  $scope.toggleAlert = function (message, error) {
    $scope.alerts.push({message: message, type: error ? 'danger' : 'success'});
  };

};