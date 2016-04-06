'use strict';

var gulp = require('gulp'),
    server = require('gulp-server-livereload'),
    del = require('del'),
    path = require('path'),
    runSequence = require('run-sequence'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),

    config = {
        buildFolder: path.resolve('build'),
        coverageFolder: path.resolve('coverage'),
        ts: [path.resolve('src/**/*.ts')],
        spec: [path.resolve('spec/**/*.ts')],
        tsConfig: path.resolve('tsconfig.json')
    },
    tsConfig = ts.createProject(config.tsConfig);


gulp.task('clean:build', () => del.sync(config.buildFolder));
gulp.task('clean:coverage', () => del.sync(config.coverageFolder));

gulp.task('transpile:src', function () {
    return gulp.src(config.ts, { base: '.' })
        .pipe(sourcemaps.init())
        .pipe(ts(tsConfig))
        .pipe(sourcemaps.write('.', {
            sourceRoot: path.join(__dirname, '.')
        }))
        .pipe(gulp.dest(config.buildFolder));
});

gulp.task('watch', ['transpile:src'], () => {
    watch(config.ts, () => runSequence('transpile:src'));
});

gulp.task('transpile:tests', ['transpile:src'], () => {
    return gulp.src(config.spec, { base: '.' })
        .pipe(sourcemaps.init())
        .pipe(ts(tsConfig))
        .pipe(sourcemaps.write('.', {
            sourceRoot: path.join(__dirname, '.')
        }))
        .pipe(gulp.dest(config.buildFolder));
});

gulp.task('build', done => {
    return runSequence(
        'clean:build',
        'transpile:src',
        done
    );
});

gulp.task('build:tests', done => {
    return runSequence(
        'clean:build',
        'clean:coverage',
        'transpile:tests',
        done
    );
});

gulp.task('coverage-server', () => {
    gulp.src('coverage')
        .pipe(server({
            livereload: false,
            open: true,
            port: 9600
        }));
});