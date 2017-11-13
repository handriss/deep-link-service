'use strict';

require('dotenv').config({ silent: true });

let gulp = require('gulp');
let runSequence = require('run-sequence');
let config = require('./tasks.config');
let tasks = require('boar-tasks-server').getTasks(gulp, config);

gulp.task('build', ['build-clean'], function(cb) {
  runSequence(['server-copy'], cb);
});

gulp.task('start', ['build'], function(cb) {
  runSequence(['server', 'server-watch'], cb);
});

gulp.task('test', ['build'], function(cb) {
  runSequence(['code-style', 'server-test'], cb);
});

gulp.task('build-clean', tasks.build.clean);

gulp.task('server', tasks.server.start);
gulp.task('server-copy', function() { return tasks.server.copy(false); });
gulp.task('server-copy-only-changed', function() { return tasks.server.copy(true); });
gulp.task('code-style', function() { return tasks.server.codeStyle(); });
gulp.task('server-watch', function() { gulp.watch(tasks.config.server.filePattern, ['server-copy-only-changed']); });
gulp.task('server-test', tasks.server.test);
gulp.task('scripts-report', function(cb) {
  return tasks.server.runCommand('server/scripts/report', cb);
});
