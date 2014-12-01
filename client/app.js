'use strict';

// Give us source maps for browserify
require('source-map-support').install();
var project = require('../project.json');

angular.module( project.name, [
  project.name + '-templates',
  'ui.router',
  'ui.bootstrap',
  'ui.bootstrap.tpls',
  'ngCookies',
  'ngSanitize',
  'ui.jq',
  'xeditable',
  require('./account').name,
  require('./auth').name,
  require('./home').name,
  require('./register').name
])

.config( function myAppConfig ($urlRouterProvider, $locationProvider, $httpProvider) {
  $urlRouterProvider.otherwise( '/home' );
  $locationProvider.hashPrefix('!');

  $httpProvider.interceptors.push(function($q) {
    return {
      'response': function(response) {
        if(response && response.config.url.match(/api/g)) {
          return response.data;
        }

        return response || $q.when(response);
      }
    };
  });
})

// Configure for bootstrap theme on elements from Bootstrap 3
.run(function (editableOptions) {
  editableOptions.theme = 'bs3';
})

.controller( 'AppCtrl', function AppCtrl ($scope, $state, $timeout, userService) {
  $scope.user = userService;
  $scope.$state = $state;

  // If the user isn't signed in, redirect to the signin / register page.
  if (!$scope.user._id && !(/signin/g.test(document.URL.toString())) && !(/register/g.test(document.URL.toString()))) {
    $timeout(function () { $state.go('signin'); });
  }

})
.constant('version', require('../package.json').version)
.factory('userService', require('./factories/factory.user.js'))
.factory('socket', require('./factories/factory.socket.js'));