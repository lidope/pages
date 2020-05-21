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

# [common.js更新历史](#common更新记录)
# [common.js所有方法](#一些方法)
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

<br>
<br>

## common更新记录

### v1.0.6.21 更新 - 2020.05.20
```$xslt
1. 优化showToast方法，复制内容成功后\n转换为空格
```

### v1.0.6.2 更新 - 2020.05.14
```angular2
1. 增加debug功能，一键开启console 使用方法:
    a. 开启http.globalData.debug 默认为true
    b. 页面所使用的 console.log 统一换成 _log
    
2. log 方法更换为 _log 方法
3. c 方法更换为 _c 方法
4. 优化同时加载多个showLoading方法
```

### v1.0.6 更新 - 2020.04.10
~~~
1. 增加滑动底部方法
2. 优化showCopyText复制偶尔不成功问题
3. 提升Toast的最大宽度
4. 增加是否是iPhoneX机型以上验证 (isIPhoneX)
5. 手机验证规则增加17字段
6. 修改服务器错误的文字提示
7. 增加错误接口地址返回
8. 增加多个ajax出错的groupEnd处理
9. 更新Modal默认高度
~~~

### v1.0.5.3 更新 - 2020.02.20
~~~
1. 修复showCopyText方法 input文字意外显示问题
~~~

### v1.0.5.2 更新 - 2020.02.02
```angular2
1. 显示ajaxPost服务器返回错误的接口
```

### v1.0.5.1 更新 - 2020.01.20
```angular2
1. ajaxPost方法header中增加client字段 区分不同端调取接口
2. 增加正则验证 zh_ch_num（只能输入英文、中文、数字)
3. 优化ajaxPost
```

### v1.0.5 更新 - 2020.01.19
```
1. 优化ajaxPost的error回调数据过多导致污染控制台
2. 增加log和c方法，使得console更加轻捷 c = console demo: log('test') c.info('text')
```

### v1.0.4 更新 - 2020.01.11
```$xslt
1. 更新优化showMessage、showModal出现多个次数以及回调失灵问题
2. 增加showToast2秒后消失的文字弹窗
3. showMessage、showModal、showToast增加内容换行功能
------------------------------------------------
# 待增加
1. 自动播放音乐
2. 微信预览图片
3. 微信上传图片
```
### v1.0.3 更新 - 2020.01.04
```$xslt
1. 新增自定义showMessage、showModal弹窗文字按钮自定义
2. 增加showCopyText可复制内容的消息弹窗
------------------------------------------------
# 待增加
1. showToast弹窗
2. 自动播放音乐
```

### v1.0.2 更新 - 2019.12.28
```
1. 新增滑动方向
2. 新增显示、隐藏页面
3. 新增上滑页面
```

### 一些方法
```$xslt
1. getQueryString 获取URL参数
2. ajax请求
3. navigateBack 关闭当前页面，返回上一页面或多个页面
4. navigateTo 保留当前页面，跳转到新页面
5. redirectTo 关闭当前页面，打开新页面
6. showLoading 显示loading
7. hideLoading 关闭loading
8. showMessage 显示消息弹窗，带确认取消按钮
9. showCopyText 可复制内容的消息弹窗，带确认取消按钮
10. showModal 显示消息弹窗，带确认按钮
11. showToast 2秒后消失的浮层
12. getStorageSync 读取缓存
13. setStorageSync 设置缓存
14. removeStorageSync 删除缓存
15. clearStorageSync 清除所有缓存
16. validate 验证
17. iosPhoneBug 解决ios下页面被第三方输入法顶上去的bug
18. getScrollDirection 滑动方向
19. showPage 显示某个页面
20. hidePage 隐藏某个页面
21. scrollPage 向上滑动某个页面
22. wrLoading 载入器
23. Player 音频播放器
24. client 获取当前机型或浏览器类型
25. isIPhoneX 是否是iPhoneX以上机型
26. onReachBottom 滑动底部事件
```

### 常见问题
```angular2
1. 文本验证
2. 命名规范，驼峰命名法 ( 禁止写a1、data1、demo22等看不懂的命名。 )
3. 尽量减少冗余代码
4. common.js里的域名( baseUrl )不要写死，尽量不要改动该文件
5. html、javascript、css代码对整齐，该打回车和空格的尽量不要偷懒
6. 项目传至服务器后，每更改一次*.js、*.css、img等都需要改对应的版本号
7. 新项目检查”页面”的授权路径和”common.js”的 “您尚未授权登录登录，请先授权登录” 授权路径
8. 及时清理console，增加debug方法，一键开启console 使用方法:  _log(123)
9. 每次做程序前先copy模版，会经常更新，也可以提出问题或自己封的方法 更新记录会在js/common.md说明
10. 不要全部都用切图，代码可以实现的尽量用代码
```

