## 目录结构
~~~
└─pages h5存放根目录
  ├─css css统一存放目录
  │ ├─animate.css 动画样式
  │ ├─reset.css 默认样式
  │ └─resetREM.css rem的默认样式
  ├─fonts 字体目录
  ├─images 图片目录
  ├─js js存放目录
  │ ├─common.js 公共文件
  │ ├─docElRem.js rem配置文件
  │ └─wxshare.js 分享文件
  ├─utils 框架、插件存放目录
  │ └─main.js 包含jQuery v3.4.1、Vue.js v2.6.11、vConsole v3.2.0
  └─.gitignore git屏蔽文件配置
~~~

<br>
<br>

# [animate.js更新历史](#animate更新记录)
# [常见问题列表](#常见问题)

<br>
<br>

### 2020.05.20 - 增加gulp打包
```$xslt
> 安装依赖模块
    npm i | cnpm i

> 配置gulpfile.js

> 开始打包
    gulp
    
> 清除打包数据 (需要单独配置clean才可使用)
    gulp clean
    
> 当前gulp版本
    CLI version: 2.2.0
    Local version: 4.0.2
```
<br>
<br>

## animate更新记录
### 2020.05.20 - 增加4个动画

```$xslt
1. 增加虚化显示动画 ( puffIn)
2. 增加虚化隐藏动画 ( puffOut )
3. 增加旋转显示动画 ( scaleIn )
4. 增加旋转隐藏动画 ( scaleOut )
```
