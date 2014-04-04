'use strict';

require('source-map-support').install();
var project = require('../project.json');

angular.module( project.name, [
  project.name + '-templates',
  'ui.router',
  // 'angulartics',
  // 'ezfb',
  'ui.bootstrap',
  'ui.bootstrap.tpls',
  'ngCookies',
  'ngSanitize',
  'ui.jq',
  'xeditable',
  // require('./account').name,
  // require('./admin').name,
  require('./auth').name
  //,
  // require('./home').name,
  // require('./register').name
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

.run(function (editableOptions) {
  editableOptions.theme = 'bs3';
})

.controller( 'AppCtrl', function AppCtrl ($scope, $state, $timeout, userService) {
  $scope.user = userService;
  $scope.$state = $state;

  if (!$scope.user._id && !(/signin/g.test(document.URL.toString())) && !(/register/g.test(document.URL.toString()))) {
    $timeout(function () { $state.go('signin'); });
  }

})
.constant('version', require('../package.json').version)
.directive('scrollOnClick', require('./directives/directive.scrollonclick.js'))
.directive('scrollTopOnClick', require('./directives/directive.scrolltoponclick'))
.factory('userService', require('./factories/factory.user.js'));