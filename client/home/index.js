'use strict';

var project = require('../../project.json');

module.exports = angular.module(project.name + '.home', [
  'ui.router'
])
.config(function config( $stateProvider ) {
  $stateProvider.state( 'home', {
    url: '/home',
    controller: 'HomeCtrl',
    templateUrl: '/home/home.tpl.html',
    resolve: {
      data: function (exerciseService) {
        return exerciseService.getDashData();
      },
      user: function (userService) {
        return userService.get();
      }
    }
  });
})
.controller('HomeCtrl', require('./controller.home.js'));