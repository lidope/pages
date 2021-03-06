/*
* ⬇⬇⬇⬇ ******** 开发者须知 ******** ⬇⬇⬇⬇
*
* 1. 配置 "fileName" 项目目录名称 默认是view目录
* 2. 配置 "distFileName"
* 2. utils文件夹存储已经压缩过的js 例: swiper.min.js, upload.min.js
* 3. 如果有不需要处理的文件夹 把对应的文件夹名添加至 noPackingName数组内 ( 默认不打包 utils、audio、fonts、video文件夹 )
*
* 注意事项
* 1. javascript尽量写在js文件内，写在html内如果包含es6、es5、则无法被解析，整一块js都不会被混淆加密
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

/*
* 打包的目录名
* */
const fileName = 'view';

/*
* 打包后代码存放目录 如果是 "." 则打包到当前根目录
* */
const distFileName = '.';

/*
* 不打包目录名
* */
const noPackingName = ['utils', 'audio', 'fonts', 'video', 'invalid'];

/*
* .css文件打包路径 (默认打包所有css)
* */
const cssList = [ fileName + '/css/**/*.css' ];

/*
* .js文件打包路径 (默认打包所有js)
* */
const jsList = [ fileName + '/js/**/*.js' ];

/*
* .html文件打包路径 (默认打包所有html)
* */
const htmlList = [ distFileName + '/rev/**/*.json', fileName + '/*.html', fileName + '/**/*.html' ];

/*
* 图片打包路径 (默认打包所有图片)
* */
const imagesList = [fileName + '/images/**/*'];

/*
* 不打包的目录
* */
let noPackingList = [];
for (let i = 0; i < noPackingName.length; i++) {
    noPackingList.push(fileName + '/'+ noPackingName[i] +'/**/*')
}

/*
* 依赖模块
* */
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
    exec = require('child_process').exec,
    colors = require('colors'),
    hash = require('gulp-rev-append');

/*
* 获取当前时间
* */
const date = new Date();

const dayList = ['日', '一', '二', '三', '四', '五', '六'];
let Year = date.getFullYear(),    // 获取完整的年份(4位, 1970-当前年份)
    Month = date.getMonth() + 1,  // 获取当前月份(0-11, 0代表1月)
    D = date.getDate(),           // 获取当前日(1-31)
    Hours = date.getHours(),      // 获取当前小时数(0-23)
    Min = date.getMinutes(),      // 获取当前分钟数(0-59)
    Sec = date.getSeconds(),      // 获取当前秒数(0-59)
    Day = date.getDay();          // 获取当前星期X(0-6, 0代表星期天)

let Format = n => n < 10? '0' + n: n;

let time = Year + '.' + Format(Month) + '.' + Format(D) + ' '  // 年月日
    + Format(Hours) + ':' + Format(Min) + ':' + Format(Sec)    // 时分秒
    + ' ' + '( 星期' + dayList[Day] + ' )';                     // 星期


/*
* 清空文件夹
*  如果distFileName值 为 "." 的话，则删除到当前gulp根目录的文件夹
* */
gulp.task('clear', async () => {
    let delList = [];

    if (distFileName === '.') {
        delList = ['css/', 'js/', 'images/', 'rev/', '*.html'];
        noPackingName.forEach(ele => {
            delList.push(ele)
        })
    } else {
        delList = [ distFileName ];
    }

    return del(delList);
});

/*
* 配置css
* */
gulp.task('css', () => {
    return gulp.src(cssList)
    .pipe(hash())
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
        mangle: true, // 是否混淆变量
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
    .pipe(hash())
    .pipe(revCollector({
        replaceReved: true, // 替换为追加Hash值后的文件名
    }))
    .pipe(htmlmin(htmlOptions))
    .pipe(gulp.dest(distFileName))
});

/**
 * image压缩
 */
gulp.task('images', _ => {
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
/*
    gulp.watch(htmlList, gulp.series('html'));
    gulp.watch(cssList, gulp.series('css'));
    gulp.watch(jsList, gulp.series('js'));
    gulp.watch(imagesList, gulp.series('images'));

    // 单独配置不处理的文件
    gulp.watch(noPackingList, gulp.series('other'));
*/

    // gulp.watch(htmlList, gulp.series('html'));
    // gulp.watch(cssList, gulp.series('css'));
    // gulp.watch(jsList, gulp.series('js'));
    // gulp.watch(imagesList, gulp.series('images'));

    // 单独配置不处理的文件
    // gulp.watch(noPackingList, gulp.series('other'));

    // 更新页面
    gulp.watch(fileName + '/**/*', gulp.series('reload'));
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
    const hostNumber = 3008;
    connect.server({
        root: fileName, // 根目录
        port: hostNumber, // 端口
        host: '::',
        livereload: true // 热更新
    });

    const browser = 'http://localhost:' + hostNumber;
    const mobile = colors.underline.bold.green('http://本地的ip:' + hostNumber);

    setTimeout(() => console.log(`
                 ╭────────────────────────────────────────────╮
                 │                                            │
                 │      浏览器: ${ browser }         │
                 |                                            |
                 │      手  机: ${ mobile }          │
                 │                                            │
                 ╰────────────────────────────────────────────╯
    `, ), 200)

});

/*
* git commit -m 命令
* */
gulp.task('commit', async () => {
    exec('git commit -m "' + time + '"', async function (err, stdout, stderr) {
        if (err) {
            if (stdout.indexOf('nothing to commit') == -1) {
                let commitError = colors.yellow('"git commit" 失败');

                console.log(colors.red(err));
                console.log(`
                    ╭─────────────────────────╮
                    │                         │
                    │    ${ commitError }    │
                    │                         │
                    ╰─────────────────────────╯
                `)
            }
        } else {
            console.log(stdout);
        }
    });
});

/*
* git上传命令，包含:
* git add .
* git commit -m ""
* git pull
* git push
* */
gulp.task('gitPush', async function (cb) {
    exec('git add --all', function (err, stdout, stderr) {
        if (!err) {
            exec('git commit -m "' + time + '"', async function (err, stdout, stderr) {
                if (err) {
                    if (stdout.indexOf('nothing to commit') == -1) {
                        let commitError = colors.yellow('"git commit" 失败');

                        console.log(colors.red(err));
                        console.log(`
                            ╭─────────────────────────╮
                            │                         │
                            │    ${ commitError }    │
                            │                         │
                            ╰─────────────────────────╯
                        `)
                    }
                } else {
                    console.info(colors.green(stdout));
                    exec('git pull --rebase', async function (err, stdout, stderr) {
                        exec('git push', async function (err, stdout, stderr) {
                            console.info(stdout);
                            console.info(stderr);
                            if (err) {
                                let errorPushDebug = colors.red('git push遇到错误');

                                console.log(colors.red(err));
                                console.log(`
                                    ╭────────────────────────╮
                                    │                        |
                                    |    ${ errorPushDebug }    |    
                                    |                        |       
                                    ╰────────────────────────╯
                                `)
                            }

                            if (stderr.indexOf('Everything') > -1) {
                                if (!err) {
                                    let errorPushDebug = colors.red('未提交任何内容到git');
                                    console.log(`
                                     ╭──────────────────────────────────────────╮
                                     │                                          │
                                     │     ${ errorPushDebug }                  |
                                     │     ${ colors.red(time) }       │
                                     │                                          │
                                     ╰──────────────────────────────────────────╯
                                    `)
                                }
                            } else {
                                if (!err) {
                                    let sucPushDebug = colors.bold.yellow('提交时间: ' + time);

                                    console.log(`
        ╭────────────────────────────────────────────────────╮
        │                                                    │
        │      ${ sucPushDebug }      │   
        │                                                    |
        ╰────────────────────────────────────────────────────╯
                                    `)
                                }
                            }
                        });
                    });
                }
            });
        } else {
            console.log(colors.red(err));
            console.log('git add 遇到以下问题')
        }
    });
})

/*
* 颜色测试 colors
* */
gulp.task('colors', async () => {
    const colorList = [ 'black', 'magenta', 'white', 'grey', 'gray', 'rainbow', 'green', 'cyan', 'yellow', 'blue' ];
    const stylesList = [
        'underline', 'inverse', 'rainbow', 'zebra', 'america', 'random',

        'brightRed', 'brightGreen', 'brightYellow', 'brightMagenta', 'brightBlue',
        'brightCyan', 'brightWhite',
    ];
    const bgColorList = [
        'bgBrightRed', 'bgBrightGreen', 'bgBrightYellow', 'bgBrightBlue',
        'bgBrightMagenta', 'bgBrightCyan', 'bgBrightWhite',

        'bgBlack', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta',
        'bgCyan', 'bgWhite', 'bgGray', 'bgGrey',
    ];

    let l = console.log;

    l('')

    bgColorList.forEach(ele => l(ele + ': ' + colors[ele]('颜色测试'))); l('');

    colorList.forEach(ele => l(ele + ': ' + colors[ele]('颜色测试'))); l('');

    stylesList.forEach(ele => l(ele + ': ' + colors[ele]('颜色测试'))); l('')
})

gulp.task('init', gulp.series('clear', gulp.parallel('css', 'js', 'other', 'images'), 'html'));

gulp.task('default', gulp.series('init'));

gulp.task('dev', gulp.series('server', 'watch'));

gulp.task('push', gulp.series('init', 'gitPush'));