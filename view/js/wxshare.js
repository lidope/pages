/**
 * Created by Administrator on 15-1-14.
 */

function removeSharePathUrl(url, arg_name_removed = 'token') {
    let u = url;
    try {
        var url = url.substring(url.indexOf('?'));
        var arr = [];
        var query_string = "";
        var s = '';
        if (url.lastIndexOf('?') == 0) {
            var arg_str = url.substr(url.lastIndexOf('?') + 1, url.length);
            if (arg_str.indexOf('&') != -1) {
                var arr = arg_str.split('&');
                for (var i in arr) {
                    if (arr[i].split('=')[0] != arg_name_removed) {
                        query_string = query_string + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
                    }
                }
                s = query_string.substr(0, query_string.length - 1);
            } else {
                if (arg_str.split('=')[0] != arg_name_removed) {
                    query_string = query_string + arg_str.split('=')[0] + "=" + arg_str.split('=')[1]
                }

                s = query_string.substr(0, query_string.length);
            }
        } else {
            return url;
        }

    } catch (e) {
        return url;
    }

    return s? (u.substring(u.indexOf('?'), 0) + '?' + s): (u.substring(u.indexOf('?'), 0));
}


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
	   
	    $.post("https://open.leaddevelop.net/work/WechatApi/getSignPackage", {
	        path : window.location.host,
            url: window.location.href
        }, function(data){
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

            options.link = removeSharePathUrl(options.link);
	
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
