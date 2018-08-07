'use strict';
var gulp = require('gulp');
var build = './build';

var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();

//compile sass and reload
gulp.task('sass', function () {
    return gulp.src('./src/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest(build))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//optimize images and reload
gulp.task('images', function() {
    return gulp.src('./src/images/*')
      .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
      .pipe(gulp.dest(build + '/img'))
      .pipe(browserSync.reload({
        stream: true
    }));
});

//serve files
gulp.task('browserSync', function() {
    browserSync.init({
      server: {
        baseDir: './'
      },
    })
});

//watching sass and image changes
gulp.task('watch', function() {
    gulp.watch('./src/**/*.scss', ['sass']);
    gulp.watch('./src/images/*', ['images']);
});

//initial build
gulp.task('build', ['sass','images','browserSync','default']);

// Run all
gulp.task('default', ['browserSync','watch']);
