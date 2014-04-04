'use strict';

var project = require('../../project.json');

module.exports = angular.module( project.name + '.login', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state('signin', {
    url: '/signin',
    controller: 'AuthCtrl',
    templateUrl: '/auth/auth.tpl.html'
  });
})

.controller( 'AuthCtrl', require('./controller.auth.js'));