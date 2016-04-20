var path = require('path'),
    gulp = require('gulp'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    csslint = require('gulp-csslint'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    clean = require('gulp-clean'),
    gulpif = require('gulp-if');

var paths = {
    js: [
        'src/*.js'
    ],
    less: [
        'src/*.less'
    ]
};

var hasExtname = function(extname) {
    if(extname[0] !== '.'){
        extname = '.' + extname;
    }
    return function(file) {
        return path.extname(file.path) === extname;
    };
};

gulp.task('clean', function(cb) {
    return gulp.src('build/')
        .pipe(clean());
});

gulp.task('css', ['clean'], function() {
    return gulp.src(paths.less)
        .pipe(plumber())
        .pipe(gulpif(hasExtname('less'), less()))
        .pipe(gulpif(true, csslint()))
        .pipe(gulpif(true, minifycss()))
        .pipe(gulp.dest('build'));
});

gulp.task('less', function() {
    return gulp.src(paths.less)
        .pipe(plumber())
        .pipe(gulpif(hasExtname('less'), less()))
        .pipe(gulpif(true, csslint()))
        .pipe(gulpif(true, minifycss()))
        .pipe(gulp.dest('build'));
});

// 注册js构建任务
gulp.task('js', ['clean'], function () {
    return gulp.src(paths.js)
        .pipe(jshint())       //js代码检查
        .pipe(uglify())     //js代码压缩
        .pipe(gulp.dest('build'))
});

gulp.task('watch', function () {
    gulp.watch('src/*', ['default'])
        .on('change', function (event) {
            console.log('文件' + event.path + '有变更, 运行任务');
        });
});

// 打包任务
gulp.task('default', ['css', 'js']);
