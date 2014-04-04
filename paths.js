'use strict';

var project = require('./project');
var path = require('path');

module.exports = {
  less: {
    targets: project.path.client + '/less/*.less',
    libs: [
      path.join(__dirname, project.path.client + '/frameworks/ui-kit'),
      path.join(__dirname, project.path.bower)
    ]
  },
  scripts: [
    project.path.client + '/**/*.js',
    '!' + project.path.client + '/{lib,lib/**,js,js/**,frameworks/ui-kit/**,frameworks/common-files/**}'
  ],
  templates: [
    project.path.client + '/**/*.tpl.html',
    '!{' + project.path.bower + ',' + project.path.bower + '/**}'
  ]
};