'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require("gulp-rename");
const cssmin = require('gulp-cssmin');
const child = require('child_process');
const gutil = require('gulp-util');
const autoprefixer = require('gulp-autoprefixer');


gulp.task('default', ['sass', 'watch']);

gulp.task('sass', function () {
    var files = './assets/sass/[^_]*.scss';

    return gulp.src(files)
        // create .css file
        .pipe(sass())
        .on('error', gutil.log)
        .pipe(rename({ extname: '.css' }))
        .pipe(gulp.dest('./assets/css'))

        // create .min.css
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest("./assets/css"))
        .pipe(gulp.dest("./_site/assets/css"));
});

gulp.task('jekyll', function() {
    const jekyll = child.spawn('jekyll', [
        'serve',
        '--watch',
        '--incremental'
    ]);

    jekyll.stdout.on('data', jekyllLogger);
    jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('deploy', function() {
    const ps = child.spawn('rsync', [
        '-ru',
        '_site/.',
        'dvks1:~/dvk-site',
        '--delete'
    ]);

    ps.stdout.on('data', jekyllLogger);
    ps.stderr.on('data', jekyllLogger);
});

gulp.task('watch', function () {
    gulp.watch('./assets/sass/**/*.scss', ['sass']);
});

function jekyllLogger(buffer) {
    buffer.toString()
        .split(/\n/)
        .forEach(function(message) {
            if(message.trim().length) {
                gutil.log('Jekyll: ' + message)
            }
        });
}
