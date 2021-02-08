document.write("<script src='https://res.wx.qq.com/open/js/jweixin-1.6.0.js'></script>");

/**
 * Created by Administrator on 15-1-14.
 */
var wxShare = {
    init : function (options){
	    
	    var setting = {
	        debug: false,
	        appId: '',
	        timestamp: '',
	        nonceStr: '',
	        signature: '',
	        jsApiList: [
	            'checkJsApi',
	            'onMenuShareTimeline',
	            'onMenuShareAppMessage',
	            'onMenuShareQQ',
				'hideMenuItems',
	            'onMenuShareWeibo',
				'scanQRCode',
				'chooseImage',
				'uploadImage',
                'closeWindow',
                'getLocation',
                'openLocation',
                'previewImage'
	        ],
	        statistics: false
	    };
	   
	    $.post("https://open.leaddevelop.net/work/WechatApi/getSignPackage", {path : window.location.host, url : window.location.href}, function(data){
		    setting.appId = data.appId;
		    setting.nonceStr = data.nonceStr;
		    setting.timestamp = data.timestamp;
		    setting.signature = data.signature;
		    setting.statistics = options.statistics ? options.statistics : false;
	        //alert("分享确认");
	        wx.config({
	            debug: setting.debug,
	            appId: setting.appId,
	            timestamp: setting.timestamp,
	            nonceStr: setting.nonceStr,
	            signature: setting.signature,
	            jsApiList: setting.jsApiList
	        });
	
	        wx.ready(function () {
	            wx.checkJsApi({
	                jsApiList: setting.jsApiList,
	                success: function (res) {
	                    //alert(JSON.stringify(res));
	                }
	            });
	
	            var shareObj = {
	                title : options.title,
	                desc : options.desc,
	                link : options.link,
	                imgUrl : options.imgUrl,
	                success: function (res) {
	                }	            
	            };
	            
	            var linetitle = options.linetitle ? options.linetitle : options.title;
	            
	            var shareLine = {
	                title : linetitle,
	                link : options.link,
	                imgUrl : options.imgUrl,
	                success: function (res) {
	                }	            
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
		        console.log(res);
	        });
	    }, "json");
    }
}
