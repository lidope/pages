document.write("<script src='//res.wx.qq.com/open/js/jweixin-1.4.0.js'></script>");

var wechat_api_url = "https://h5.fitsns.cn/work/WechatApi/";

/**
 * Wechat JSSDK
 */
var wxShare = {
    init : function (options){

        var setting = {
            debug: true,
            appId: '',
            timestamp: '',
            nonceStr: '',
            signature: '',
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'hideMenuItems',
                'openLocation',
                'getLocation',
                'scanQRCode',
                'chooseImage',
                'uploadImage'
            ],
            statistics: false
        };
        //window.location.href
        $.post(wechat_api_url+"getJsSign", {url : window.location.href}, function(res){
            setting.appId = res.d.appId;
            setting.nonceStr = res.d.nonceStr;
            setting.timestamp = res.d.timestamp;
            setting.signature = res.d.signature;

            //alert(JSON.stringify(res.d));

            wx.config({
                appId: setting.appId,
                timestamp: setting.timestamp,
                nonceStr: setting.nonceStr,
                signature: setting.signature,
                jsApiList: setting.jsApiList
            });

            wx.ready(function () {
                
                wx.checkJsApi({
                    jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'openLocation',
                        'getLocation'
                    ],
                    success: function (res) {
                        //alert(11);
                        //alert(JSON.stringify(res));
                    }
                });


                var shareObj = {
                    title : options.title,
                    desc : options.desc,
                    link : options.link,
                    imgUrl : options.imgUrl,
                    success: function (res) {}
                };

                var linetitle = options.linetitle ? options.linetitle : options.title;

                var shareLine = {
                    title : linetitle,
                    link : options.link,
                    imgUrl : options.imgUrl,
                    success: function (res) {}
                };

                //分享朋友
                wx.onMenuShareAppMessage(shareObj);

                //分享朋友圈
                wx.onMenuShareTimeline(shareLine);

                //分享到qq
                wx.onMenuShareQQ(shareObj);

                //分享到腾讯微博
                wx.onMenuShareWeibo(shareObj);

                // 禁用复制链接按钮
                wx.hideMenuItems({
                    menuList: ["menuItem:copyUrl"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });

            });

            wx.error(function(res){
                alert(JSON.stringify(res));
            });
        }, "json");
    }
}
