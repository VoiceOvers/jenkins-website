'use strict';

var gulp = require('gulp');
var path = require('path');
var project = require('./project');
var $ = require('gulp-load-plugins')();
var server = require('tiny-lr')();
var util = require('gulp-util');
var paths = require('./paths');
var nodemon = require('nodemon');

function less(target) {
  gulp.src(target || paths.less.targets)
    .pipe($.less({ sourceMap: true, paths: paths.less.libs }))
    .pipe(gulp.dest(project.path.client + '/css'))
    .pipe($.size())
    .pipe($.livereload(server));
}

gulp.task('less', function () {
  less();
});

gulp.task('templates', function () {
  gulp.src(paths.templates)
    .pipe($.cached('templates'))
    .pipe($.minifyHtml({ empty: true, spare: true, quotes: true }))
    .pipe($.ngHtml2js({ moduleName: project.name + '-templates' }))
    .pipe($.concat('js/templates.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(project.path.client))
    .pipe($.livereload(server))
    .pipe($.size());
});

gulp.task('lint', function () {
  var client_paths = [
    project.path.client + '/**/*.js',
    '!' + project.path.client + '/{templates.js,js/**,frameworks/common-files,frameworks/common-files/**,lib,lib/**,frameworks/ui-kit,frameworks/ui-kit/**}'
  ];

  gulp.src(client_paths)
    .pipe($.cached('linting-client'))
    .pipe($.jshint(project.path.client + '/.jshintrc'))
    .pipe($.jshint.reporter('jshint-stylish'));

  gulp.src(project.path.server + '/**/*.js')
    .pipe($.cached('linting-server'))
    .pipe($.jshint(project.path.server + '/.jshintrc'))
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('scripts', function() {
  var browserify = require('browserify');
  var fs = require('fs');
  var es6ify = require('es6ify');
  var path = require('path');
  var mold = require('mold-source-map');
  var jsRoot = path.join(__dirname, project.path.client, 'js');
  var bundlePath = path.join(jsRoot, 'bundle.js');
  var mapFilePath = path.join(jsRoot, 'bundle.js.map');

  function mapFileUrlComment(sourcemap, cb) {
    sourcemap.sourceRoot('../');
    sourcemap.mapSources(mold.mapPathRelativeTo(path.join(__dirname, project.path.client)));

    // write map file and return a sourceMappingUrl that points to it
    fs.writeFile(mapFilePath, sourcemap.toJSON(2), 'utf-8', function (err) {
      if (err) return console.error(err);
      cb('//@ sourceMappingURL=' + path.basename(mapFilePath));
    });
  }

  browserify()
    .add(es6ify.runtime)
    .transform(es6ify)
    .require(require.resolve(__dirname + '/' + project.path.client + '/app.js'), { entry: true })
    .bundle({ debug: true })
    .on('error', function (err) {
      util.log(util.colors.red(err));
      util.beep();
    })
    .pipe(mold.transform(mapFileUrlComment))
    .pipe(fs.createWriteStream(bundlePath));
});

gulp.task('dependencies', function () {
  return gulp.src([
    project.path.bower + '/angular-easyfb/angular-easyfb.js',
    project.path.bower + '/angular-ui-router/release/angular-ui-router.js',
    project.path.bower + '/angulartics/src/angulartics.js',
    project.path.bower + '/angulartics/src/angulartics-ga.js',
    project.path.bower + '/angular-ui-utils/ui-utils.min.js',
    project.path.bower + '/modernizr/modernizr.js',
    project.path.bower + '/es5-shim/es5-shim.js',
    project.path.bower + '/json3/lib/json3.js',
    project.path.bower + '/angular-bootstrap/ui-bootstrap-tpls.js',
    project.path.bower + '/chosen/chosen.jquery.js',
    project.path.bower + '/angular-xeditable/dist/js/xeditable.js',
    project.path.bower + '/angular-masonry/angular-masonry.js',
    project.path.bower + '/angular-toggle-switch/angular-toggle-switch.js'
  ])
  .pipe($.concat('deps.js'))
  .pipe(gulp.dest(project.path.client + '/js/'));
});

gulp.task('server', function () {
  nodemon('-e "js json" --watch server --harmony ' + project.path.server);
});

gulp.task('deployment', ['dependencies', 'scripts', 'templates']);

gulp.task('default', ['scripts'], function () {

  server.listen(35729, function () {

    gulp.watch(paths.less.targets, function (evt) {
      util.log(util.colors.cyan('Compiling LESS files'));
      less(evt.path);
    });

    gulp.watch(paths.scripts, ['scripts', 'lint']);
    gulp.watch(project.path.server + '/**/*.js', ['lint']);
    gulp.watch(project.path.client + '/**/*.tpl.html', ['templates']);

    gulp.watch([project.path.client + '/js/bundle.js'], function (evt) {
      util.log(util.colors.cyan('Reloading browserify bundle'));
      server.changed(evt.path);
    });

    nodemon('-e "js json" --watch server --harmony ' + project.path.server);

  });

});
