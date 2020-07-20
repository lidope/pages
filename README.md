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
  │ └─└─main.js 包含jQuery v3.4.1、Vue.js v2.6.11、vConsole v3.2.0
  │─.babelrc gulp 打包文件配置
  │─.gitignore git屏蔽文件配置
  └─gulpfile.js gulp打包配置文件

~~~