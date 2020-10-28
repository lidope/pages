# common.js

### v1.1.3 更新 - 2020.10.28
```
1. 去除授权成功后url存在token的问题
```

### v1.1.2 更新 - 2020.09.25
```
1. 新增getPhoneSize方法，返回当前机型的种类
    * 0 大机型
    * 1 小机型
    * 2 授权后带bar的小机型 或者很小的机型

2. 更新本地设置baseUrl无需在输入 "https:" 或者 "/", 系统会自动识别并添加
3. 更新getStorageSync方法若没获取到则返回空，之前是null

4. 新增showToast方法的direction参数增加center 跟middle一样，从页面中间显示 
    例: http.showToast('test', 'center')

5. 新增ajaxPost方法params参数内的loadingText字段值，有该字段值loading文字则会显示该内容
    例 改变接口loading文字: http.ajaxPost('demo/uploadImage', { loadingText: '上传中' })

6. 新增ajaxPost方法params参数内的ajaxPostType字段值，有该字段值ajax的请求方式会用该字段值
    例 get请求: http.ajaxPost('demo/getAddress', { ajaxPostType: 'get' })

7. 更新开启微信授权或微信分享后，单独关闭某个页面的授权或分享方法 
    在对应页面的head内写入 var ___closeWechat = 'auth' || 'share' || 'authShare' || 'shareAuth';

    @value String
      auth 关闭微信授权
      share 关闭微信分享
      authShare 或 shareAuth 两者都关闭
    
    注意：
        1. 最好在页面head标签内增加
        2. 该方法仅在 http.globalData.openShare 或 http.globalData.openAuth 开启时有效
    
    例:
      <head>
        <script> var ___closeWechat = 'auth' </script>
      </head>

8. 新增 getQueryAllString 方法，获取所有url参数 返回一个对象或者字符串
9. 修复已知自动开启授权后，页面未增加监听报错问题 
10. 新增手机横屏提示
```

### v1.1.1 更新 - 2020.09.10
```
1. 新增 $h 方法 去除小数运算浮点问题
2. 新增ajaxPost域名为本地路径时的设置，使本地开放更便捷
3. 新增gulp push打包命令，打包成功后自动上传至git
4. http.globalData.debug修改默认值为false (以前是true)，本地开发的话 会自动为true
5. ajaxPost方法 在debug为true时会显示报错的接口路径，为false则不显示
6. ajaxPost方法params参数新增ajaxPostType字段(ajax的请求方式)，如果有该字段，则ajax的请求方式会用该字段值，默认是post
7. 控制台增加页面响应时间(PageLoadTIme)，去掉无用信息
8. 修复gulp push 打包后上传至git有时失效问题
9. 微信授权更新，之前是开启授权后自动触发事件，现在是手动监听授权状态，如下
    wxAuth.addEventListener('auth', e => {})
```

### v1.1.0 更新 - 2020.07.28
```
1. 新增获取手机方向方法 getPhoneDirection
2. 新增获取机型范围方法 getPhoneList 目前已知 
    [iPhone XR, iPhone XS, iPhone XS Max, iPhone 11]
    [iPhone X, iPhone 6/7/8 Plus, iPhone 5/6/7/8]
3. 去除ajaxPost方法url后跟的时间戳
4. 修复validate方法的tram不传otherParmas导致的报错
5. 去除validate方法不传内容的提示
6. 更新手机号验证规则
```

### v1.0.9 更新 - 2020.07.20
```
1. 新增编辑url即可开启VConsole功能 url后跟 ?dev_mode=debug

    > 用法 https://xxx.com?dev_mode=debug

2. VConsole版本升级 v3.2.0 -> v3.3.4
```

### v1.0.8 更新 - 2020.06.18
```
1. 移除每个页面的授权、分享。common.js里自动授权分享
2. 授权和分享需要单独开启，默认为关闭 开启方法如下

    > http.globalData.openAuth  开启授权 默认false
    > http.globalData.openShare 开启分享 默认false
    > http.globalData.share 分享参数，开启分享需要配置分享参数

    注意： 
        如果某个页面需要单独配置分享, 请在页面引入common.js的上方增加 "sessionStorage.setItem('closeWechatShare', 1)" 

3. gulp打包方式改版

使用方法

> 安装依赖
    cnpm i 注意： 如果没有cnpm请先安装淘宝镜像 npm install -g cnpm --registry=https://registry.npm.taobao.org

> 配置gulpfile.js内的fileName 默认是view目录

> 运行环境 ( 开启运行环境同时也会自动执行项目打包 )
    gulp dev

> 项目打包
    gulp
```

### v1.0.7 更新 - 2020.06.03
```$xslt
1. 优化showCopyText方法，复制内容成功后\n转换为空格
2. 修复ajaxPost方法error参数问题
3. 解决ios下伪类不起作用的bug
4. validate验证增加input参数 -> 去除特殊字符以及首尾空格
5. 新增showToast是否有透明层功能 默认没有 (以前是有)
```

### v1.0.6.2 更新 - 2020.05.14
```
1. 新增debug功能，一键开启console 使用方法:
    a. 开启http.globalData.debug 默认为true
    b. 页面所使用的 console.log 统一换成 _log
    
2. log 方法更换为 _log 方法
3. c 方法更换为 _c 方法
4. 优化同时加载多个showLoading方法
```

### v1.0.6 更新 - 2020.04.10
~~~
1. 新增滑动底部方法
2. 优化showCopyText复制偶尔不成功问题
3. 提升Toast的最大宽度
4. 新增是否是iPhoneX机型以上验证 (isIPhoneX)
5. 手机验证规则增加17字段
6. 修改服务器错误的文字提示
7. 新增错误接口地址返回
8. 新增多个ajax出错的groupEnd处理
9. 更新Modal默认高度
~~~

### v1.0.5.3 更新 - 2020.02.20
~~~
1. 修复showCopyText方法 input文字意外显示问题
~~~

### v1.0.5.2 更新 - 2020.02.02
```
1. 显示ajaxPost服务器返回错误的接口
```

### v1.0.5.1 更新 - 2020.01.20
```
1. ajaxPost方法header中增加client字段 区分不同端调取接口
2. 新增正则验证 zh_ch_num（只能输入英文、中文、数字)
3. 优化ajaxPost
```

### v1.0.5 更新 - 2020.01.19
```
1. 优化ajaxPost的error回调数据过多导致污染控制台
2. 新增log和c方法，使得console更加轻捷 c = console demo: log('test') c.info('text')
```

### v1.0.4 更新 - 2020.01.11
```$xslt
1. 更新优化showMessage、showModal出现多个次数以及回调失灵问题
2. 新增showToast2秒后消失的文字弹窗
3. showMessage、showModal、showToast增加内容换行功能
------------------------------------------------
# 待增加
1. 自动播放音乐 (废弃)
2. 微信预览图片 (废弃)
3. 微信上传图片 (废弃)
```
### v1.0.3 更新 - 2020.01.04
```$xslt
1. 新增自定义showMessage、showModal弹窗文字按钮自定义
2. 新增showCopyText可复制内容的消息弹窗
------------------------------------------------
# 待增加
1. showToast弹窗 (已增加)
2. 自动播放音乐 (废弃)
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
16. validate 验证规则
17. iosPhoneBug 解决ios下页面被第三方输入法顶上去的bug
18. getScrollDirection 滑动方向
19. showPage 显示某个页面
20. hidePage 隐藏某个页面
21. scrollPage 向上滑动某个页面
22. wrLoading 载入器
23. Player 音频播放器 (音频实例化)
24. client 获取当前机型或浏览器类型
25. isIPhoneX 是否是iPhoneX以上机型
26. onReachBottom 滑动底部事件
27. getPhoneList 获取机型范围
28. getPhoneDirection 获取手机方向
29. $h 去除小数运算浮点问题
30. getPhoneSize 获取机型大小
```
