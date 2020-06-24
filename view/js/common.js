/*
 * common.js v1.0.8 *
 */
document.write("<script src='https://wxshare.leaddevelop.net/wxShare.js'></script>");

var baseUrl = window.location.protocol + "//" + window.location.host + "/";
var authUrl = baseUrl + "work/WechatApi/getAuthUser";
var errorUrl = baseUrl + "qiye/error.html";
var authLocationPath = authUrl + "?redirect_url=" + encodeURIComponent(window.location.href);

// 解决ios下伪类不起作用的bug
document.body.addEventListener('touchstart', function () {});

// 获取URL参数
function getQueryString(name)
{
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//ajax请求
var http = {
    globalData: {
        debug: true,
        openShare: false, // 是否开启分享
        openAuth: false, // 是否开启授权
        share: {
            title: '', // 标题
            desc: '', // 描述
            link: baseUrl, // 链接
            imgUrl: '' // 图片
        },
    },

    init() {
        if (http.globalData.openAuth) {
            http.getUserAuth();
        }

        if (http.globalData.openShare && !sessionStorage.getItem('closeWechatShare')) {
            http.getWechatShare();
        }
    },

    ajaxPost:function(url, params, callback, error, showLoading) {
        showLoading = showLoading == 0 ? 0 : 1;
        params.v = new Date().getTime();

        if (baseUrl.indexOf('file://') > -1) {
            throw '致命错误: baseUrl不能是本地路径'
            return false;
        }

        var token = sessionStorage.getItem('token') || '';
        var header = {
            token: token,
            client: '2',
        };

        var ajaxUrl = baseUrl + url + '?_' + new Date().getTime();

        var ajaxBeforeSend = function() {
            if (showLoading == 1) {
                http.showLoading();
            }
        };

        var ajaxSuccess = function (data) {
            if (showLoading == 1) {
                http.hideLoading();
            }

            if (data.c) {
                http.hideLoading();

                if (data.c == 110) {
                    // token失效
                    http.showModal('您尚未授权登录登录，请先授权登录!', function() {
                        sessionStorage.clear();
                        window.location.href = authLocationPath;
                    }, { title: '操作失败' })
                } else if (data.c == 400) {
                    // 页面不存在
                    window.location.href = errorUrl;
                } else if (data.c == 10000) {
                    // 登录超时，请重新登录
                    http.showModal(data.m, function () {
                        localStorage.clear();
                        sessionStorage.clear();
                        location.replace(baseUrl);
                    })
                } else {
                    if (error) {
                        error(data)
                    } else {
                        data.m? http.showModal(data.m): http.showModal('操作失败')
                    }
                }
                return false;
            } else {
                callback(data);
            }
        };

        var ajaxError = function (msg) {
            http.hideLoading();
            http.showModal('当前网络不稳定，请稍后再试~\n' + url)

            console.group('服务器返回错误');
                console.log('└─状态码: ' + msg.status);
                console.log('└─接口: ' + url);
                    console.group('原因');
                    console.error(msg.responseText);
            console.groupEnd();
            console.groupEnd();
            console.groupEnd();
        };

        var ajaxSetting = {
            url : ajaxUrl,
            type : "post",
            headers: header,
            data : params,
            dataType : "json",
            beforeSend : ajaxBeforeSend,
            success : ajaxSuccess,
            error : ajaxError
        };

        $.ajax(ajaxSetting);
    },

    // 用户授权
    getUserAuth() {
        let token = sessionStorage.getItem('token');
        if (!token) {
            if (getQueryString('token')) {
                sessionStorage.setItem('token', getQueryString('token'));
                // showPage('.container');
                setTimeout(() => {
                    if (main) {
                        if (main.getDetail) {
                            main.getDetail()
                        }
                    } else {
                        setTimeout(() => {
                            if (main) {
                                if (main.getDetail) {
                                    main.getDetail()
                                }
                            }
                        }, 200)
                    }
                }, 200);
            } else {
                sessionStorage.clear();
                window.location.href = authLocationPath;
            }
        } else {
            // showPage('.container');
            setTimeout(() => {
                if (main) {
                    if (main.getDetail) {
                        main.getDetail()
                    }
                } else {
                    setTimeout(() => {
                        if (main) {
                            if (main.getDetail) {
                                main.getDetail()
                            }
                        }
                    }, 200)
                }
            }, 200);
        }
    },

    // 微信分享
    getWechatShare() {
        setTimeout(() => {
            try {
                if (wx && wxShare) {
                    wxShare.init(http.globalData.share);
                }
            }
            catch (e) {
               setTimeout(() => {
                   if (wx && wxShare) {
                       wxShare.init(http.globalData.share);
                   }
               }, 300)
            }

        }, 300)
    },

    // 关闭当前页面，返回上一页面或多个页面
    navigateBack(delta) {
        !delta && history.go(-1) || history.go('-' + delta);
    },

    // 保留当前页面，跳转到新页面
    navigateTo(url) {
        if (!url) return;
        location.href = url
    },

    // 关闭当前页面，打开新页面
    redirectTo(url) {
        if (!url) return;
        location.replace(url);
    },

    // 显示loading
    showLoading(content) {
        /*
        * content 要显示的loading内容，支持换行 \n
        * */

        if ($('.lead_loading_block').length) {
            $('.lead_loading_block .lead_loading span').html(http.getLineFeedHtml(content || '加载中'))
            return false;
        }

        if (content) content = http.getLineFeedHtml(content)

        var leadLoading = `
            <div class="lead_loading_block lead_transparent col items center">
                <div class="lead_loading lead_smallBig_animate col items">
                    <div class="lead_icon_loading"></div>
                    <span>${ content || '加载中' }</span>
                </div>
            </div>
        `;

        $('body').append(leadLoading);

        setTimeout(function () {
            $('.lead_loading').length && $('.lead_loading').addClass('showLeadLoading');
        }, 20)

        $('.lead_loading_block').length && $('.lead_loading_block').on('touchmove', function (event) {
            event.preventDefault();
        })
    },

    // 隐藏loading
    hideLoading() {
        if ($('.lead_loading_block').length) {
            $('.lead_loading').removeClass('showLeadLoading');
            setTimeout(function () {
                $('.lead_loading_block').remove();
            }, 250)
        }
    },

    // 显示消息弹窗，带确认取消按钮
    showMessage(content, confirm, cancel, otherParams) {
        /*
        * content 要显示的消息，支持换行\n
        * confirm 确认按钮
        * cancel 取消按钮
        * otherParams: {
        *   title: 标题 默认为提示
        *   confirmColor: 确认颜色 默认为 #5f646e
        *   cancelColor: 取消颜色 默认为 #999
        *   confirmText: 确认文字
        *   cancelText: 取消文字
        * }
        * */

        if (content) {
            content = content.constructor == Array || content.constructor == Object? JSON.stringify(content): this.getLineFeedHtml(content);
        }

        var leadMessage = `
            <div class="lead lead_message_block col items center">
                <div class="lead_message lead_smallBig_animate col items">
                    <div class="lead_message_title col items center">
                        <span class="nowrap">${ otherParams && otherParams.title || '提示' }</span>
                    </div>
                    <div class="lead_message_content col items center">
                        <span>${ content || '' }</span>
                    </div>
                    <div class="lead_message_button row items center">
                        <span class="flex_group_1 col items center" style="color: ${ otherParams && otherParams.cancelColor || '#999' }">${ otherParams && otherParams.cancelText || '取消' }</span>
                        <span class="flex_group_1 col items center" style="color: ${ otherParams && otherParams.confirmColor || '#5f646e' }">${ otherParams && otherParams.confirmText || '确定' }</span>
                    </div>
                </div>
            </div>
        `;

        if (!$('.lead_mask').length) {
            $('body').append(`<div class="lead_mask"></div>`)
        }

        $('body').append(leadMessage);

        setTimeout(function () {
            if ($('.lead_message').length > 1) {
                var leadMessage = $('.lead_message');
                for (var i = 0; i < leadMessage.length; i++) {
                    if (!leadMessage.eq(i).hasClass('.showLeadMessage')) {
                        leadMessage.eq(i).addClass('showLeadMessage');
                    }
                }
            } else {
                $('.lead_message').length && $('.lead_message').addClass('showLeadMessage');
            }
        }, 20)

        $('.lead_message_block').length && $('.lead_message_block').on('touchmove', function (event) {
            event.preventDefault();
        })

        var is_click = true;

        var $lead_message_block = $('.lead_message_block');
        var lead_message_button = $lead_message_block.eq($lead_message_block.length - 1).find('.lead_message_button span');

        lead_message_button.off('click');
        lead_message_button.on('click', function () {
            if (is_click) {
                is_click = false;
                var _this = $(this);
                _this.closest('.lead_message').removeClass('showLeadMessage');
                setTimeout(function () {
                    var _index = _this.index();
                    _this.closest('.lead_message_block').remove();
                    if (!$('.lead').length) {
                        $('.lead_mask').remove();
                    }
                    is_click = true;
                    _index == 1 && confirm && confirm('confirm');
                    _index == 0 && cancel && cancel('cancel');
                }, 250)

            }
        })
    },

    // 可复制内容的消息弹窗，带确认取消按钮
    showCopyText(content, confirm, cancel, otherParams) {
        /*
        * content 要复制的消息，支持换行\n
        * confirm 确认按钮
        * cancel 取消按钮
        * otherParams: {
        *   title: 标题 默认为提示
        *   confirmColor: 确认颜色 默认为 #5f646e
        *   cancelColor: 取消颜色 默认为 #999
        *   confirmText: 确认文字
        *   cancelText: 取消文字
        * }
        * */

        if (content) {
            content = content.constructor == Array || content.constructor == Object? JSON.stringify(content): this.getLineFeedHtml(content);
        }

        var leadMessage = `
            <div class="lead lead_message_copy col items center">
                <div class="lead_copy lead_smallBig_animate col items">
                    <div class="lead_copy_title col items center">
                        <span class="nowrap">${ otherParams && otherParams.title || '提示' }</span>
                    </div>
                    <div class="lead_copy_content col items center">
                        <span>${ content || '' }</span>
                    </div>
                    <div class="lead_copy_button row items center">
                        <span class="flex_group_1 col items center" style="color: ${ otherParams && otherParams.cancelColor || '#999' }">${ otherParams && otherParams.cancelText || '取消' }</span>
                        <span class="flex_group_1 col items center" style="color: ${ otherParams && otherParams.confirmColor || '#5f646e' }">${ otherParams && otherParams.confirmText || '复制' }</span>
                    </div>
                </div>
            </div>
        `;

        if (!$('.lead_mask').length) {
            $('body').append(`<div class="lead_mask"></div>`)
        }

        var input = document.createElement("input");

        content = content.replace(/<\/br>/g, ' ');

        input.value = content;
        input.readOnly = true;
        input.style.opacity = 0;
        input.style.fontSize = '20px';
        input.style.position = 'fixed';
        input.style.left = '-9999999px';
        input.style.top = '-999999px';
        $('body').append(leadMessage);
        $('.lead_message_copy').append(input);

        setTimeout(function () {
            if ($('.lead_copy').length > 1) {
                var leadCopy = $('.lead_copy');
                for (var i = 0; i < leadCopy.length; i++) {
                    if (!leadCopy.eq(i).hasClass('.showLeadCopy')) {
                        leadCopy.eq(i).addClass('showLeadCopy');
                    }
                }
            } else {
                $('.lead_copy').length && $('.lead_copy').addClass('showLeadCopy');
            }
        }, 20)

        $('.lead_message_copy').length && $('.lead_message_copy').on('touchmove', function (event) {
            event.preventDefault();
        })

        var is_click = true;

        $('.lead_copy_button span').click(function () {
            if (is_click) {
                is_click = false;
                var _this = $(this);
                var _index = _this.index();
                _this.closest('.lead_copy').removeClass('showLeadCopy');

                if (_index == 1) {
                    input.select();
                    input.setSelectionRange(0, input.value.length)
                    document.execCommand('Copy');
                    // http.showModal('复制成功')
                }

                setTimeout(function () {
                    _this.closest('.lead_message_copy').remove();
                    if (!$('.lead').length) {
                        $('.lead_mask').remove();
                    }
                    is_click = true;
                    _index == 1 && confirm && confirm('confirm');
                    _index == 0 && cancel && cancel('cancel');
                }, 250)

            }
        })
    },

    // 显示消息弹窗，带确认按钮
    showModal(content, confirm, otherParams) {
        /*
        * content 要显示的消息，支持换行\n
        * confirm 确认按钮
        * otherParams: {
        *   title: 标题 默认为提示
        *   confirmColor: 确认颜色 默认为 #5f646e
        *   confirmText: 确认文字
        * }
        * */

        if (content) {
            content = content.constructor == Array || content.constructor == Object? JSON.stringify(content): this.getLineFeedHtml(content);
        }

        var leadModal = `
            <div class="lead lead_modal_block col items center">
                <div class="lead_modal lead_smallBig_animate col items">
                    <div class="lead_modal_title col items center">
                        <span class="nowrap">${ otherParams && otherParams.title || '提示' }</span>
                    </div>
                    <div class="lead_modal_content col items center">
                        <span>${ content || '' }</span>
                    </div>
                    <div class="lead_modal_button row items center">
                        <span class="flex_group_1 col items center" style="color: ${ otherParams && otherParams.confirmColor || '#5f646e' }">${ otherParams && otherParams.confirmText || '确定' }</span>
                    </div>
                </div>
            </div>
        `;

        if (!$('.lead_mask').length) {
            $('body').append(`<div class="lead_mask"></div>`)
        }

        $('body').append(leadModal);

        setTimeout(function () {
            if ($('.lead_modal').length > 1) {
                var leadMessage = $('.lead_modal');
                for (var i = 0; i < leadMessage.length; i++) {
                    if (!leadMessage.eq(i).hasClass('.showLeadModal')) {
                        leadMessage.eq(i).addClass('showLeadModal');
                    }
                }
            } else {
                $('.lead_modal').length && $('.lead_modal').addClass('showLeadModal');
            }
        }, 20)

        $('.lead_modal_block').length && $('.lead_modal_block').on('touchmove', function (event) {
            event.preventDefault();
        })

        var is_click = true;

        var $lead_modal_block = $('.lead_modal_block');
        var lead_modal_button = $lead_modal_block.eq($lead_modal_block.length - 1).find('.lead_modal_button span');

        lead_modal_button.off('click');
        lead_modal_button.on('click', function () {
            if (is_click) {
                is_click = false;
                var _this = $(this);
                _this.closest('.lead_modal').removeClass('showLeadModal');
                var _index = _this.index();
                setTimeout(function () {
                    _this.closest('.lead_modal_block').remove();
                    if (!$('.lead').length) {
                        $('.lead_mask').remove();
                    }
                    is_click = true;
                    confirm && confirm('confirm');
                }, 250)
            }
        })
    },

    // 2秒后消失的浮层
    showToast(content, hasModal = false) {
        /*
        * content String 要显示的消息，支持换行\n
        * hasModal Boolean 是否有遮罩层，默认false
        * */
        if (content) {
            content = content.constructor == Array || content.constructor == Object? JSON.stringify(content): this.getLineFeedHtml(content);
        }

        let leadToastBlock = document.createElement('div');
        leadToastBlock.className = 'lead_toast_block lead_transparent col items';

        let leadToastView = document.createElement('div');
        leadToastView.className = 'lead_toast';

        let leadToastSpan = document.createElement('span');
        leadToastSpan.innerHTML = content || '';

        leadToastView.appendChild(leadToastSpan);

        setTimeout(function () {
            leadToastView.className = 'lead_toast lead_toast_show';
        }, 20)

        leadToastBlock.appendChild(leadToastView);

        if (!hasModal) {
            leadToastBlock.className = 'lead_toast_block lead_transparent lead_toast_nopointer col items'
        }

        $('body').append(leadToastBlock)

        setTimeout(function() {
            leadToastView.className = 'lead_toast lead_toast_hide'
            leadToastBlock.remove();
        }, 2000)

    },

    // \n 转换为 </br>
    getLineFeedHtml(content) {
        return String(content).replace(/\n/g, "</br>")
    },

    // 读取缓存
    getStorageSync(name) {
        return JSON.parse(localStorage.getItem(name))
    },

    // 设置缓存
    setStorageSync(name, val) {
        localStorage.setItem(name, JSON.stringify(val))
    },

    // 删除缓存
    removeStorageSync(name) {
        localStorage.removeItem(name);
    },

    // 清除所有缓存
    clearStorageSync() {
        localStorage.clear();
    },

    /* 验证 */
    validate(name, content, otherParams)
    {

        /*
        * 验证的种类
        * name {
        *   mobile 手机验证
        *   email 邮箱验证
        *   tram 删除多余空格
        *   symbols 是否包含特殊字符
        *   zh_ch 是否都是汉字或者英文
        *   emoji 是否存在emoji字符
        *   input 去除input特殊字符以及首尾空格
        * }
        * content 验证的内容
        * otherParams {
        *   tram { -> 空格验证 默认删除所有空格
        *       type: left 删除左边空格 right 删除右边空格 leftRight 删除两边空格
        *   }
        * }
        *
        * */

        if (!name) {
            http.showModal('name值不能为空');
            return false;
        } else if (!content) {
            http.showModal('content不能为空');
            return false;
        }

        var regRuleEmoji = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
        var regRule2Emoji = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;

        switch (name) {
            // 手机验证
            case 'mobile':
                var mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                return mobileReg.test(content)? true: false;
                break;

            // 邮箱验证
            case 'email':
                var regEmail = /^([a-zA-Z]|[0-9]|[._-])(\w|\-|.)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                return regEmail.test(content)? true: false;
                break;

            // 删除空格
            case 'tram':
                if (otherParams.type == 'left') {
                    // 删除左边空格
                    return content.replace(/(^\s*)/g, "");
                } else if (otherParams.type == 'right') {
                    // 删除右边空格
                    return content.replace(/(\s*$)/g, "");
                } else if (otherParams.type == 'leftRight') {
                    // 删除两边空格
                    return content.replace(/(^\s*)|(\s*$)/g, "");
                } else {
                    // 删除所有空格
                    return content.replace(/\s/g, "");
                }
                break;

            // 是否包含特殊字符
            case 'symbols':
                var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;œ∑´®†¥¨ˆøπåß∂ƒ©˙∆˚¬…æΩ≈ç√∫˜µ„‰ˇÁ∏’»ÍÎÏ˝ÓÔÒÚ¸˛◊ıÂ¯˘¿≤≥÷¡™£¢∞§¶•ªº–≠«'[\]]/im;
                var regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
                if (regEn.test(content) || regCn.test(content)) {
                    // 包含特殊字符
                    return true;
                } else {
                    // 不包含特殊字符
                    return false;
                }
                break;

            // 只能输入英文、中文、数字
            case 'zh_ch_num':
                var reg = /^[\u0391-\uFFE5A-Za-z0-9]+$/;
                var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;œ∑´®†¥¨ˆøπåß∂ƒ©˙∆˚¬…æΩ≈ç√∫˜µ„‰ˇÁ∏’»ÍÎÏ˝ÓÔÒÚ¸˛◊ıÂ¯˘¿≤≥÷¡™£¢∞§¶•ªº–≠«'[\]]/im;
                var regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
                if (reg.test(content) && !regEn.test(content) && !regCn.test(content)) {
                    // 都是汉字或者英文
                    return true;
                } else {
                    // 不是纯汉字或英文
                    return false;
                }
                break;

            // 只能输入英文、中文
            case 'zh_ch':
                var reg = /^[\u0391-\uFFE5A-Za-z]+$/;
                var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;œ∑´®†¥¨ˆøπåß∂ƒ©˙∆˚¬…æΩ≈ç√∫˜µ„‰ˇÁ∏’»ÍÎÏ˝ÓÔÒÚ¸˛◊ıÂ¯˘¿≤≥÷¡™£¢∞§¶•ªº–≠«'[\]]/im;
                var regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
                if (reg.test(content) && !regEn.test(content) && !regCn.test(content)) {
                    // 都是汉字或者英文
                    return true;
                } else {
                    // 不是纯汉字或英文
                    return false;
                }
                break;

            // 是否存在emoji字符
            case 'emoji':
                if (content.match(regRuleEmoji) || regRule2Emoji.test(content)) {
                    // 有emojo字符
                    return true;
                } else {
                    // 无emojo字符
                    return false;
                }
                break;

            // 去除input特殊字符以及首尾空格
            case 'input':
                // 过滤特殊表情
                content = content.replace(regRuleEmoji, '');
                content = content.replace(regRule2Emoji, '');
                content = content.replace(regRule3Emoji, '')
                content = unescape(escape(content).replace(/\%uD.{3}/g, ''));

                // 删除两边空格
                content = val.trim();

                return content;

                break;

            default:
                http.showModal('暂无此验证规则')
                break;
        }
    },

    // 滑动到底部事件
    onReachBottom(_el, callback) {
        if (!_el) _el = $(window);
        _el.scroll(function () {
            let height = _el.height();
            let scrollHeight = _el[0].scrollHeight;
            let scrollTop = _el[0].scrollTop;

            if (scrollTop + height >= scrollHeight) {
                if (callback) callback();
            }
        })
    },

    // 是否是iPhoneX以上机型
    isIPhoneX() {
        if (typeof window !== 'undefined' && window) {
            return /iphone/gi.test(window.navigator.userAgent) && window.screen.height >= 812;
        }
        return false;
    },

    // 解决ios下页面被第三方输入法顶上去的bug
    iosPhoneBug()
    {
        setTimeout(() => {
            if (client && client.os == 'iPhone') {
                const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0, Math.max(scrollHeight - 1, 0));
            }
        }, 150)
    },
};

http.init();

// 滑动方向
var hasScrollPageCommonJs = 1;
var getScrollDirection = function (element, callUp, callDown) {
    /*
    * element 要滑动的元素，default body
    * callUp 向上滑动
    * callDown 向下滑动
    * */
    var that = this;
    var scrollElement = $('body');
    $(window).bind('touchstart', function(e) {

        if (hasScrollPageCommonJs == 1) {
            startX = e.originalEvent.changedTouches[0].pageX,
                startY = e.originalEvent.changedTouches[0].pageY;

            $(window).bind('touchmove',function(e) {

                //获取滑动屏幕时的X,Y
                endX = e.originalEvent.changedTouches[0].pageX,
                    endY = e.originalEvent.changedTouches[0].pageY;

                //获取滑动距离
                distanceX = endX-startX,
                    distanceY = endY-startY;

                // 判断滑动方向
                if (Math.abs(distanceX) < Math.abs(distanceY) && distanceY < 0 && hasScrollPageCommonJs) {

                    // console.log('往上滑动');
                    hasScrollPageCommonJs = 0;

                    setTimeout(function () {
                        hasScrollPageCommonJs = 1;
                    }, 500)
                    if (callUp) callUp('向上滑动');
                    $(window).unbind("touchmove").unbind("touchstart");
                } else if (Math.abs(distanceX) < Math.abs(distanceY) && distanceY > 0 && hasScrollPageCommonJs){
                    // console.log('往下滑动');

                    hasScrollPageCommonJs = 0;

                    setTimeout(function () {
                        hasScrollPageCommonJs = 1;
                    }, 4000)

                    if (callDown) callDown('向下滑动');
                }

            });

            $(window).bind('touchend',function(e) {
                $(window).unbind("touchmove");
            })
        }
    });
}

;(function() {
    var browser = {
        ua  : navigator.userAgent,
        init: function () {
            this.OS = this.searchString(this.dataOS) || "an unknown OS";
            this.BS = this.searchBrowser(this.dataBS);
            if(this.OS == 'iPhone' || this.OS == 'iPad' || this.OS == 'Android' || this.OS == 'Winphone' ){
                this.mobile = true;
            }else{
                this.mobile = false;
            }
        },
        searchString: function (data) {
            for (var i=0;i<data.length;i++)	{
                var dataString = this.ua;
                if (dataString) {
                    if (dataString.indexOf(data[i].forSearch) != -1)
                        return data[i].forShow;
                }
            }
        },
        searchBrowser: function(data){
            var result = '';
            for (var i=0;i<data.length;i++)	{
                var dataString = this.ua;
                if (dataString) {
                    if (dataString.indexOf(data[i].forSearch) != -1){
                        result += data[i].forShow + '|';
                    }
                }
            }
            return result;
        },
        dataOS : [
            {
                forSearch: "iPhone",
                forShow: "iPhone"
            },
            {
                forSearch: "iPad",
                forShow: "iPad"
            },
            {
                forSearch: "Android",
                forShow: "Android"
            },
            {
                forSearch: "Windows Phone",
                forShow: "Winphone"
            }
        ],
        dataBS: [
            {
                forSearch: "360browser",
                forShow: "360"
            },
            {
                forSearch: "Maxthon",
                forShow: "Maxthon"
            },
            {
                forSearch: "UCBrowser",
                forShow: "uc"
            },
            {
                forSearch: "Oupeng",
                forShow: "opera"
            },
            {
                forSearch: "Opera",
                forShow: "opera"
            },
            {
                forSearch: "Sogou",
                forShow: "sogou"
            },
            {
                forSearch: "baidu",
                forShow: "baidu"
            },
            {
                forSearch: "Safari",
                forShow: "safari"
            },
            {
                forSearch: "MicroMessenger",
                forShow: "weixin"
            },
            {
                forSearch: "QQ/",
                forShow: "qq"
            },
            {
                forSearch: "Weibo",
                forShow: "weibo"
            },
            {
                forSearch: "MQBrowser",
                forShow: "360"
            },
            {
                forSearch: "MQQBrowser",
                forShow: "qqbrowser"
            },
            {
                forSearch: "CriOS",
                forShow: "Maxthon"
            }
        ]

    };

    browser.init();
    window.client = { browser : browser.BS, os : browser.OS, ifmobile : browser.mobile};

})();

//载入器
function wrLoading(objname, filearray, callback, type) {
    this.callback = callback;
    this.objname = objname;
    this.filearray = filearray;
    this.type = type;
    this.init();
    (filearray && filearray.length > 0) ? this.loadNext() : this.onlyshow();
}

wrLoading.prototype = {
    loadList: {},
    loaded: 0,
    retried: 0,
    init: function () {
        this.obj = $(this.objname);
    },
    show: function () {
        this.obj.fadeIn(300);
    },
    hide: function (fn) {
        fn();
        return false;
        var This = this;
        if (this.type) {
            this.obj.fadeOut(300, function () {
                fn();
            });
        } else {
            fn();
        }
    },
    onlyshow: function () {
        var This = this;
        this.show();
        setTimeout(function () {
            This.hide(This.callback);
        }, 300);
    },
    loadNext: function () {
        var This = this;
        if (This.filearray[This.loaded]) {
            var ext = This.checkext(This.filearray[This.loaded]);
            if (ext == 'img')
                This.getImgNext();
            else if (ext == 'audio')
                This.getAudioNext();
        }
    },
    MovePoint: function (That) {
        var This = this;
        That.loaded++;
        if (That.checkProcess())
            return false;
        if (!That.type && That.obj.find('.percent').length > 0) {
            This.setPercent(Math.ceil(This.loaded / This.filearray.length * 100));
        }
        That.retried = 0;
        setTimeout(function () {
            That.loadNext();
        }, 1);
    },
    getImgNext: function () {
        var This = this;
        var oImg = new Image();
        oImg.src = 'images/' + This.filearray[This.loaded];
        if (oImg.complete) {
            This.makeloadArr(oImg);
            This.MovePoint(This);
        } else {
            oImg.onload = function () {
                This.makeloadArr(this);
                This.MovePoint(This);
            };
            oImg.onerror = function () {
                This.retried++;
                if (This.retried < 3) {
                    This.getImgNext();
                } else {
                    This.MovePoint(This);
                }
            };
        }
    },
    getAudioNext: function () {
        var This = this;
        var audio = new Audio();
        audio.src = This.filearray[This.loaded];
        audio.load();
        audio.addEventListener('canplay', function () {
            This.makeloadArr(this);
            This.MovePoint(This);
        });
        audio.addEventListener('error', function () {
            This.getAudioNext();
        });
    },
    makeloadArr: function (obj) {
        var This = this;
        This.loadList[This.loaded] = obj;
    },
    checkProcess: function () {
        var This = this;
        if (This.loaded >= This.filearray.length) {
            if (!This.type && This.obj.find('.percent').length > 0)
                This.setPercent(100);
            setTimeout(function () {
                This.hide(This.callback);
            }, 100);
            This.loaded = 0;
            This.retried = 0;
            return true;
        }
        return false;
    },
    getLoadArr: function () {
        return this.loadList;
    },
    checkext: function (name) {
        var arrext = name.split('.');
        var tmpext = arrext[arrext.length - 1].toLowerCase();
        if ('mp3|wav|wma|ogg'.indexOf(tmpext) > -1)
            return 'audio';
        if ('jpg|gif|bmp|png'.indexOf(tmpext) > -1)
            return 'img';
    },
    setPercent: function (p) {
        document.getElementsByClassName('percent')[0].innerHTML = p + '%';
        $('.loading_progress div').css({
            transform: 'translateX(-'+ ( 100 - p ) +'%)'
        })
    }
};

;(function(){
    function Player(el,auto){
        this.el = el;
        this.isPlay = true;
        this.auto = auto;
        this.init();
    }
    Player.prototype = {
        init: function(){
            var _this = this,attr = {loop: false, preload: "auto", src: this.el.attr("data-src")};
            this._audio = new Audio;
            for (var i in attr){
                attr.hasOwnProperty(i) && i in this._audio && (this._audio[i] = attr[i]);
            }
            if(this.auto){
                this._audio.addEventListener('ended', function() {
                    this.currentTime = 0;
                    this.play();
                }, false);
            }
            this._audio.load();
            this._audio.volume = 0.9;
            this.el.on('click', function(){
                _this._play();
            });
        },

        _play: function(){
            if(!this.isPlay){
                this._audio.play();
                this.el.addClass('on');
            }else{
                this._audio.pause();
                this.el.removeClass('on');
            }
            this.isPlay = !this.isPlay;
        },

        _getState: function(){
            return this.isPlay;
        },

        _playOn: function(){
            this._audio.play();
            this.el.addClass('on');
            this.isPlay = true;
        },

        _playOff: function(){
            this._audio.pause();
            this.el.removeClass('on');
            this.isPlay = false;
        }
    }
    window.Player = Player;
})();

;(function () {
    // 解决ios后退不刷新页面问题
    if (client.os == 'iPhone' || client.os == 'iPad') {
        window.addEventListener('pageshow', function(e) {
            if (e.persisted || window.performance && window.performance.navigation.type == 2) {
                if (main) {
                    main.getDetail && main.getDetail();
                }
            }
        });
    }
})()

// 自定义全局js
;(function () {
    // 显示某个页面
    var showPage = function (showElement) {
        /*
        * showElement (String) 要显示的元素 demo: .page01 || #page01
        * */

        if (!showElement) {
            http.showModal('参数错误，请检查');
            return false;
        }

        var _pageShow = $(showElement);
        _pageShow.css('transition', '.5s linear all')
        _pageShow.css('opacity', 0);
        _pageShow.removeClass('hide');

        setTimeout(function () {
            _pageShow.css('opacity', 1);
            setTimeout(function () {
                _pageShow.removeAttr('style');
            }, 520)
        }, 520)
    };
    window.showPage = showPage;

    // 隐藏某个页面
    var hidePage = function (hideElement) {
        /*
        * hideElement (String) 要隐藏的元素 demo: .page02 || #page02
        * 不传则隐藏所有page页面
        * */

        var _pageHide = $(hideElement);

        if (hideElement) {
            _pageHide.css('transition', '.45s linear all')
            _pageHide.css('opacity', 0);
            setTimeout(function () {
                _pageHide.addClass('hide');
                _pageHide.removeAttr('style');
            }, 500)

        } else {
            for (var i = 0; i < $('.page').length ; i++) {
                if (!$('.page').eq(i).hasClass('hide')) {
                    $('.page').eq(i).addClass('hide');
                }
            }
        }

    };
    window.hidePage = hidePage;

    // 向上滑动某个页面
    var scrollPage = function (element) {
        /*
        *  element 要滑动的元素类名 demo: .page02 || #page02
        * */

        if (!element) {
            http.showModal('参数错误，请检查');
            return false;
        }

        window._elementWin = element;

        hasScrollPageCommonJs = 1;

        getScrollDirection(element, direction => {
            hasScrollPageCommonJs = 0;
            var _element = $(window._elementWin);
            var _nextElement = _element.next();

            if (!_element.attr('scroll-y')) {

                _nextElement && _nextElement.removeClass('hide');

                setTimeout(function () {
                    _element.css({
                        transform: 'translateY(-100vh)'
                    });

                    _nextElement && _nextElement.css({
                        transform: 'translateY(-100vh)'
                    });

                    setTimeout(function () {
                        _element.addClass('hide');
                        _element.removeAttr('style');
                        _element.removeAttr('scroll-y');

                        _nextElement && _nextElement.css({
                            transition: '0s linear all',
                            transform: 'translateY(0)',
                        });

                        setTimeout(function () {
                            _nextElement && _nextElement.removeAttr('style');
                        }, 200)
                    }, 600)
                }, 200)

            }
        })

    };
    window.scrollPage = scrollPage;

    window._c = console;
    if (http.globalData.debug) {
        window._log = console.log;
    } else {
        window._log = () => { return '' };
    }
})();