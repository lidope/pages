## [查看common.js更新记录](common.md)
## [查看animate.css更新记录](animate.md)
## [查看其他更新记录](update.md)
<br/>

## gulp打包
```
注意事项：
    默认打包到主目录下，改代码或添加图片时一定要注意在view目录内添加或修改
    如果在打包后的目录内修改 再次打包则会删除

使用方法

> 安装依赖
    cnpm i

        注意： 如果没有cnpm请先安装淘宝镜像, npm有一定几率安装失败 
              cnpm安装命令: npm install -g cnpm --registry=https://registry.npm.taobao.org

> 开启本地运行环境
    gulp dev 或 npm run dev

    本地运行环境地址 
        localhost:3008    

    注意：开启后手机上也可以同步查看，查看方法 电脑和手机连同一个局域网
         输入电脑本机ip 192.168.xxx.xxx:3008 则可访问
         查看电脑主机ip方法⬇
            Windows 打开cmd 输入ipconfig
            Mac 打开终端 输入ifconfig

> 项目打包
    gulp 或 npm run build

> 项目打包完毕后上传至git
    gulp push 或 npm run push

    注意：如果遇到多人开发情况下 gulp push 打包有时会提示git pull
         需先git pull后在手动 git push

> 清除打包文件
    gulp clear 或 npm run clear

```

<br>

## 目录结构
~~~
┌─view 源代码存放目录
│  ├─css css统一存放目录
│  │  ├─animate.css 动画样式
│  │  ├─reset.css 默认样式
│  │  └─resetREM.css rem的默认样式
│  ├─fonts css统一存放目录
│  ├─images 图片目录 注意：此目录内的图片都会被打包
│  ├─invalid 页面提示
│  │  ├─popo.html 公共文件
│  │  ├─wechat.html 公共文件
│  │  ├─weibo.html 公共文件
│  │  └─workwechat.html 公共文件
│  ├─js js存放目录
│  │  ├─common.js 公共文件
│  │  ├─docElRem.js rem配置文件
│  │  └─wxshare.js 微信分享文件
│  ├─utils 不需要打包的文件夹 框架、插件存放目录 ( 用于存放xx.min.js 已经压缩过的文件 )
│  │  └─main.js 包含jQuery v3.4.1、Vue.js v2.6.11、vConsole v3.3.4、 iNoBounce - v0.1.6 weixin-jssdk v1.6.0
│─.babelrc 打包es6所用到的配置
│─.gitignore git屏蔽文件配置
└─gulpfile.js gulp打包配置文件
~~~