'use strict';

var project = require('../../project.json');

module.exports = angular.module( project.name + '.register', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'register', {
    url: '/register',
    controller: 'RegisterCtrl',
    templateUrl: '/register/register.tpl.html'
  });
})
.controller( 'RegisterCtrl', require('./controller.register.js'));