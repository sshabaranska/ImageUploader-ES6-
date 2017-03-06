var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');

gulp.task('es6', function() {
	browserify({ debug: true })
		.transform(babelify, {'presets': ['es2015']})
		.require('./www/js/index.js', { entry: true })
		.bundle()
		.on('error',gutil.log)
		.pipe(source('build.js'))
    	.pipe(gulp.dest('./www/js/release/'));
});

gulp.task('watch',function() {
	gulp.watch(['./www/**/*.js'],['es6'])
});
 
gulp.task('default', ['es6','watch']);
