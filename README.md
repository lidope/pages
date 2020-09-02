
<br/>
<hr>
<hr>

## gulp打包
```

使用方法

> 安装依赖
    cnpm i 
        注意： 如果没有cnpm请先安装淘宝镜像 npm install -g cnpm --registry=https://registry.npm.taobao.org

> 开启本地运行环境
    gulp dev

    本地运行环境地址 
        localhost:3008    

    注意：开启后手机上也可以同步查看，查看方法 电脑和手机连同一个局域网
         输入电脑本机ip 192.168.xxx.xxx:3008 则可访问
         查看电脑主机ip方法⬇
            Windows 打开cmd 输入ipconfig
            Mac 打开终端 输入ifconfig

```

<br>

## 目录结构
~~~
└─pages h5存放根目录
  ├─view 页面存放目录
  │ ├─css css统一存放目录
  │ │ ├─animate.css 动画样式
  │ │ ├─reset.css 默认样式
  │ │ └─resetREM.css rem的默认样式
  │ ├─fonts 字体目录
  │ ├─images 图片目录 注意：此目录内的图片都会被打包
  │ ├─js js存放目录
  │ │ ├─common.js 公共文件
  │ │ ├─docElRem.js rem配置文件
  │ │ └─wxshare.js 分享文件
  │ ├─utils 不需要打包的文件夹 框架、插件存放目录 ( 用于存放xx.min.js 已经压缩过的文件 )
  │ └─└─main.js 包含jQuery v3.4.1、Vue.js v2.6.11、vConsole v3.3.4
  │─.babelrc gulp 打包文件配置
  │─.gitignore git屏蔽文件配置
  └─gulpfile.js gulp打包配置文件

~~~