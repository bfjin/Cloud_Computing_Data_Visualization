var gulp = require('gulp');
var shell = require('gulp-shell');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var open = require('gulp-open');
var es = require('event-stream');
var argv = require('yargs')
  .default('tag', "v1.0")
  .alias('t', 'tag')
  .argv;

gulp.task('clean-dist', shell.task([
  'rm -rf dist'
]));

gulp.task('build', ['clean-dist'], shell.task([
  'python -m compileall data_visualization'
]));

gulp.task('dist', ['build'], function () {
  return gulp.src(["data_visualization/**/!(*.py)"])
    .pipe(gulp.dest('dist'))
    .on('finish', function() {
      runSequence('clean');
    })
});

gulp.task('clean', function() {
  return gulp.src(["data_visualization/**/*.pyc"])
    .pipe(clean());
})

gulp.task('default', ['build', 'dist']);
gulp.task('run', ['default', 'dist'], function() {
  return es.concat(gulp.src('')
    .pipe(shell([
      'python dist/manage.pyc runserver'
    ])),
    gulp.src('')
      .pipe(open({uri: 'http://localhost:8000', app: 'chrome'}))
    );
});

gulp.task('docker-publish', ['default'], shell.task([
  'docker build -t shuliyey/cloud_computing_data_visualization:' + argv.tag + ' .',
  'docker push shuliyey/cloud_computing_data_visualization:' + argv.tag
]));
