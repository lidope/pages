# commin.js
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
```
