var gulp = require('gulp');
var shell = require('gulp-shell');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
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
  gulp.src(["data_visualization/**/!(*.py)"])
    .pipe(gulp.dest('dist'))
    .on('finish', function() {
      runSequence('clean');
    })
});

gulp.task('clean', function() {
  gulp.src(["data_visualization/**/*.pyc"])
    .pipe(clean());
})

gulp.task('default', ['build', 'dist']);

gulp.task('docker-publish', ['default'], shell.task([
  'docker build -t shuliyey/cloud_computing_data_visualization:' + argv.tag + ' .',
  'docker push shuliyey/cloud_computing_data_visualization:' + argv.tag
]));