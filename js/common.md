# common.js

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
