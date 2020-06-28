/*
* ⬇⬇⬇⬇ ******** 开发者须知 ******** ⬇⬇⬇⬇
*
* 1. 需要配置 "fileName" 当前文件路径 默认是view目录
* 2. utils文件夹存储已经压缩过的js 例: swiper.min.js, upload.min.js
* 2. 如果有不需要处理的文件 需去底部的 "other" 和 "watch" 单独配置 例: fonts文件夹 ( 默认不打包 utils文件夹 )
*
*  ⬆⬆⬆⬆ ******** ⬆⬆⬆⬆ ******** ⬆⬆⬆⬆/
*/


/*
* 打包配置
* */
const fileName = 'view'; // 要打包的文件夹名称
const distFileName = 'dist'; // 打包后的文件文件夹名称
const noPackingName = 'noPacking'; // 不打包的文件夹名称

const cssList = [ fileName + '/css/**/*.css' ]; // css文件打包路径
const jsList = [ fileName + '/js/**/*.js' ]; // js文件打包路径
const htmlList = [ distFileName + '/rev/**/*.json', fileName + '/*.html', fileName + '/**/*.html' ]; // html文件打包路径
const imagesList = [fileName + '/images/**/*']; // img文件打包路径
const noPackingList = [fileName + '/'+ noPackingName +'/**/*']; // 不打包的目录

const gulp = require('gulp'),
    babel = require('gulp-babel'),
    autoprefixer = require('gulp-autoprefixer'),
    htmlmin = require('gulp-htmlmin'),
    cleanCss = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    connect = require("gulp-connect"),
    del = require('del');

/*
* 清空文件夹
* */
gulp.task('clear', () => {
    return del([ distFileName ]);
});

gulp.task('css', () => {
    return gulp.src(cssList)
        .pipe(autoprefixer({ // 自动加兼容前缀
            overrideBrowserslist: [ '> 5%' ], // 兼容使用率超过5%的浏览器
            cascade: false // 前缀美化
        }))
        .pipe(cleanCss({ // 压缩CSS
            advanced: false, // 是否开启高级优化（合并选择器等）
            compatibility: 'ie8', // 保留ie8以下兼容写法
            keepBreaks: false, // 是否保留换行
            keepSpecialComments: '*' // 保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(rev())
        .pipe(gulp.dest(distFileName + '/css'))
        .pipe(rev.manifest()) // 文件名加Hash值，配合上上行使用
        .pipe(gulp.dest(distFileName + '/rev/css'))
});

gulp.task('js', () => {
    return gulp.src(jsList)
        .pipe(babel())
        .pipe(uglify({
            mangle: true // 是否混淆变量
        }))
        .pipe(rev())
        .pipe(gulp.dest(distFileName + '/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(distFileName + '/rev/js'))
});

gulp.task('html', () => {
    var htmlOptions = {
        removeComments: true,// 清除HTML注释
        collapseWhitespace: true,// 压缩HTML
        collapseBooleanAttributes: true,// 省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,// 删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,// 删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,// 删除<style>和<link>的type="text/css"
        minifyJS: true,// 压缩页面JS
        minifyCSS: true// 压缩页面CSS
    };

    return gulp.src(htmlList)
        .pipe(revCollector({
            replaceReved: true, // 替换为追加Hash值后的文件名
        }))
        .pipe(htmlmin(htmlOptions))
        .pipe(gulp.dest(distFileName))
});

/**
 * image压缩
 */
gulp.task('images', function() {
    return gulp.src( imagesList )
    .pipe(imagemin({
        distgressive: true,
        progressive: true, // 无损压缩jpg图片
        interlaced: true, // 隔行扫描gif进行渲染
        svgoPlugins: [{ removeViewBox: false }] // 不要移除svg的viewbox属性
    }))
    .pipe(rev())
    .pipe(gulp.dest(distFileName + '/images'))
    .pipe(rev.manifest())
    .pipe(gulp.dest(distFileName + '/rev/images'));
});

/*
* 单独配置不处理的文件
* */
gulp.task('other', async () => {
    // gulp.src([ fileName + '/utils/**/*' ]).pipe(rev()).pipe(gulp.dest(distFileName + '/utils')).pipe(rev.manifest()).pipe(gulp.dest(distFileName + '/rev/utils'))
    gulp.src(noPackingList).pipe(gulp.dest(distFileName + '/' + noPackingName))
});

gulp.task('watch', async () => {
    gulp.watch(htmlList, gulp.series('html'));
    gulp.watch(cssList, gulp.series('css'));
    gulp.watch(jsList, gulp.series('js'));
    gulp.watch(imagesList, gulp.series('images'));

    // 单独配置不处理的文件
    gulp.watch(noPackingList, gulp.series('other'));

    // 更新页面
    gulp.watch(distFileName + '/**/*', gulp.series('reload'));

});

gulp.task('reload', () => {
    return gulp.src(htmlList).pipe(connect.reload()); // 页面重新加载
})


gulp.task('server', async () => {
    connect.server({ // 启用本地服务器
        root: distFileName, // 根目录
        port: 3008, // 端口
        host: '::',
        livereload: true // 热更新
    });
});

gulp.task('init', gulp.series('clear', gulp.parallel('css', 'js', 'other', 'images'), 'html'));

gulp.task('default', gulp.series('init'));

gulp.task('dev', gulp.series('init', gulp.parallel('server', 'watch')));