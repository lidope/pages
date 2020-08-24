/*
* ⬇⬇⬇⬇ ******** 开发者须知 ******** ⬇⬇⬇⬇
*
* 1. 需要配置 "fileName" 当前文件路径 默认是view目录
* 2. utils文件夹存储已经压缩过的js 例: swiper.min.js, upload.min.js
* 2. 如果有不需要处理的文件夹 把对应的文件夹名添加至 noPackingName数组内 ( 默认不打包 utils、audio、fonts、video文件夹 )
*
*  ⬆⬆⬆⬆ ******** ⬆⬆⬆⬆ ******** ⬆⬆⬆⬆/
*/

/* 使用方法
* ----------------------------
* gulp 打包
* gulp dev 本地测试
* gulp push 打包并且上传git
* ----------------------------
* */


/*
* 打包配置
* */
const fileName = 'view'; // 要打包的文件夹名称
const distFileName = 'dist'; // 打包后的文件文件夹名称
const noPackingName = ['utils', 'audio', 'fonts', 'video']; // 不打包的文件夹名称

const cssList = [ fileName + '/css/**/*.css' ]; // css文件打包路径
const jsList = [ fileName + '/js/**/*.js' ]; // js文件打包路径
const htmlList = [ distFileName + '/rev/**/*.json', fileName + '/*.html', fileName + '/**/*.html' ]; // html文件打包路径
const imagesList = [fileName + '/images/**/*']; // img文件打包路径
let noPackingList = [];

// 不打包的目录
for (let i = 0; i < noPackingName.length; i++) {
    noPackingList.push(fileName + '/'+ noPackingName[i] +'/**/*')
}

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
    del = require('del'),
    exec = require('child_process').exec;

/*
* 清空文件夹
* */
gulp.task('clear', () => {
    return del([ distFileName ]);
});

/*
* 配置css
* */
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

/*
* 配置js
* */
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


/*
* 配置html
* */
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
        // .pipe(rev())
        .pipe(gulp.dest(distFileName + '/images'))
    // .pipe(rev.manifest())
    // .pipe(gulp.dest(distFileName + '/rev/images'));
});

/*
* 单独配置不处理的文件
* */
gulp.task('other', async () => {

    for (let i = 0; i < noPackingName.length; i++) {
        gulp.src(noPackingList[i]).pipe(gulp.dest(distFileName + '/' + noPackingName[i]))
    }
});

/*
* 监听文件变动，使浏览器自动刷新
* */
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

/*
* 页面重新加载
* */
gulp.task('reload', () => {
    return gulp.src(htmlList).pipe(connect.reload());
})


/*
* 启用本地服务器
* */
gulp.task('server', async () => {
    connect.server({
        root: distFileName, // 根目录
        port: 3008, // 端口
        host: '::',
        livereload: true // 热更新
    });
});

/*
* git status
* */
gulp.task('status', async function () {
    exec('git status', function (err, stdout, stderr) {
        if (err) {
            console.log('遇到错误');
            console.log(err);
        } else {
            console.info(stdout);
            console.info(stderr);
        }
    });
});

/*
* git add --all
* */
gulp.task('add', async function (cb) {
    exec('git add --all', function (err, stdout, stderr) {
        console.info(stdout);
        console.info(stderr);
    });
})

/*
* git commit -m
* */
gulp.task('commit', async () => {
    let date = new Date();

    let dayList = ['日', '一', '二', '三', '四', '五', '六'];

    let cont = date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + ' 星期' + dayList[date.getDay()];

    setTimeout(() => {
        exec('git commit -m "' + cont + '"', async function (err, stdout, stderr) {
            if (err) {
                if (stdout.indexOf('nothing to commit') == -1) {
                    console.log(`
                ----------------------------------------------------
               ｜                                                  ｜
               ｜    "git commit" 遇到错误 错误原因  ⬇️  ⬇️  ⬇️       ｜
               ｜                                                  ｜
                ----------------------------------------------------
               
                `)
                    console.log(err);
                }
            } else {
                console.info(stdout);
            }
        });
    }, 500)
});

/*
* git pull
* */
gulp.task('pull', async () => {
    exec('git pull', async function (err, stdout, stderr) {
        console.info(stdout);
        console.info(stderr);
    });
});

/*
* git push
* */
gulp.task('push', async () => {
    setTimeout(() => {
        exec('git push', async function (err, stdout, stderr) {
            console.info(stdout);
            console.info(stderr);
            if (err) {
                console.log(`
            ----------------------------------------------------
            |                                                   
            |      git push遇到错误：      
            |                                                   
            ----------------------------------------------------
           
            `)
                console.log(err);
            }

            let date = new Date();

            let dayList = ['日', '一', '二', '三', '四', '五', '六'];

            let cont = date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + ' ( 星期' + dayList[date.getDay()] + ' )';


            if (stderr.indexOf('Everything') > -1) {
                if (!err) {
                    console.log(`
                ----------------------------------------------------
                |                                                   |
                |      未提交任何内容到git                             |                
                |      提交时间：${ cont }      |
                |                                                   |                    
                ----------------------------------------------------
               
                `)
                }
            } else {
                if (!err) {
                    console.log(`
                ----------------------------------------------------
                |                                                   |
                |      提交时间：${ cont }    |
                |                                                   |
                ----------------------------------------------------
               
                `)
                }
            }
        });
    }, 500)
});

/*
* git push origin prod
* */
gulp.task('prod', async () => {
    exec('git push origin prod', async function (err, stdout, stderr) {
        console.info(stdout);
        console.info(stderr);
        if (err) {
            console.log('遇到错误');
            console.log(err);
        }
    });
});

gulp.task('init', gulp.series('clear', gulp.parallel('css', 'js', 'other', 'images'), 'html'));

gulp.task('default', gulp.series('init'));

gulp.task('dev', gulp.series('init', gulp.parallel('server', 'watch')));

gulp.task('push', gulp.series('init', gulp.parallel('status', 'add'), 'commit', 'pull', 'push'));

gulp.task('push prod', gulp.series('init', gulp.parallel('status', 'add'), 'commit', 'pull', 'prod'));