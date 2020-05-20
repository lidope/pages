const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const minfy = require('gulp-minify-css');
const htmlmin = require('gulp-htmlmin');
const clean = require('gulp-clean'); // 清空文件夹

/*
* 清空文件夹
* @clean params
* @force 注意：慎用此参数，配置不对可能会误删文件
* */

gulp.task('clean', async function(callback) {
    return false;
    // 需要清理时打开此方法
    // return gulp.src('../dist', { read: false}).pipe(clean({force: true}));
});

gulp.task('default', async function() {
    gulp.src([
        'css/reset.css',
        'css/animate.css'
    ]).pipe(minfy()).pipe(gulp.dest('../dist/css'));

    gulp.src([
        'js/common.js',
        'js/wxshare.js',
        'js/docElRem.js'
    ]).pipe(babel({ presets: ['@babel/env'] })).pipe(uglify()).pipe(gulp.dest('../dist/js'));

    gulp.src(['./utils/*.js']).pipe(gulp.dest('../dist/utils'));

    var htmlOptions = {
        removeComments: true,// 清除HTML注释
        collapseWhitespace: true,// 压缩HTML
        collapseBooleanAttributes: false,// 省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false,// 删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,// 删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,// 删除<style>和<link>的type="text/css"
        minifyJS: true,// 压缩页面JS
        minifyCSS: true// 压缩页面CSS
    };

    gulp.src(['./*.html']).pipe(htmlmin(htmlOptions)).pipe(gulp.dest('../dist/'));

    gulp.src("images/**/*").pipe(gulp.dest('../dist/images'))
    gulp.src("images/").pipe(gulp.dest('../dist/images'))

    gulp.src("fonts/").pipe(gulp.dest('../dist/fonts'))
});