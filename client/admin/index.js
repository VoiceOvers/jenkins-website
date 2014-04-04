'use strict';

var project = require('../../project.json');

module.exports = angular.module(project.name + '.admin', [
  'ui.router'
])
.config(function config( $stateProvider ) {
  $stateProvider
    .state( 'admin', {
      url: '/admin',
      controller: 'AdminCtrl',
      templateUrl: '/admin/admin.tpl.html',
      resolve: {
        data: function (admin) {
          return admin.getAdminData();
        },
        user: function (userService) {
          return userService.get();
        }
      }
    })
    .state ('admin.util', {
      url: '/util',
      controller: 'AdminUtilCtrl',
      templateUrl: '/admin/util/admin.util.tpl.html'
    });
})
.controller('AdminCtrl', require('./controller.admin.js'))
.controller('AdminUtilCtrl', require('./util/controller.admin.util.js'))
.factory('admin', require('./factory.admin.js'));




