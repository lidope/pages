/*
 * Update Time 2021.01.30
 * common.js v1.1.6
 * 2019-2021 © lead
 */

/** 域名 **/
var baseUrl = window.location.protocol + '//' + window.location.host + '/';

/** 本地调试的域名，不会影响线上，可以写死 **/
var devBaseUrl = '';

/** 授权地址 **/
var authUrl = baseUrl + 'work/WechatApi/getAuthUser';

/** 授权跳转地址 **/
var authLocationPath = authUrl + '?redirect_url=' + encodeURIComponent(window.location.href);

/*
* 关闭微信授权或者分享 (单独对某个页面配置)
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
* */
var ___closeWechat;

/** 监听微信授权 **/
var wxAuth;

/** 本地开发验证 **/
var _hostList = ['192.168', 'file://', 'localhost', '127.0.0.1'], _isHostLen = 0;

for (let i = 0; i < _hostList.length; i++) baseUrl.indexOf(_hostList[i]) > -1 && _isHostLen++;

/** 非本地写入分享文件 **/
!_isHostLen && document.write("<script src='https://open.leaddevelop.net/wxShare2.0.js'></script>");

var http = {

    globalData: {
        /*
        ********************** 请勿手动开启，就算手动开启，也会自动关闭 **********************
        *
        * 开启debug 默认false，false则关闭所有console及ajaxPost网络不稳定的接口路径展示
        * debug 目前功能
        *   1. 关闭|打开所有 console
        *   2. 显示|隐藏ajaxPost网络不稳定的接口路径展示
        *
        * 目前本地环境已自动打开debug，其他环境自动关闭debug
        *
        ********************** 请勿手动开启，如需手动开启，记得关闭 **********************
        */
        debug: false,

        /* 开启微信分享 */
        openShare: true,

        /* 开启微信授权 */
        openAuth: false,

        /* 开启横屏提示 */
        openPhoneScreenX: true,

        /** 微信分享 **/
        share: {
            title: '',      // 标题
            desc: '',       // 描述
            link: baseUrl,  // 链接
            imgUrl: ''      // 图片
        },

        /* 检测环境 默认是在微信内打开，如需其他环境，则配置 checkAppBrowser值，如果都可以打开，则checkAppBrowser值为0
        * 1 微信
        * 2 企业微信
        * 3 微信或者企业微信
        * 4 微博
        * 5 网易POPO
        * 1000 其他
        * */
        checkAppBrowser: 1,
        checkAppBrowserList: [
            { id: 1, name: '微信', page: 'wechat' },
            { id: 2, name: '企业微信', page: 'work' },
            { id: 3, name: '微信或者企业微信', page: 'workwechat' },
            { id: 4, name: '微博', page: 'weibo' },
            { id: 5, name: '网易POPO', page: 'popo' },
            { id: 1000, name: '其他', page: 'other' },
        ],

        /** 本地开发 1 是本地 无需修改 **/
        isLocal: _isHostLen? 1: 0,

        /** token存sessionStorage还是localStorage
         * 0 sessionStorage
         * 1 localStorage
         * **/
        getTokenType: 0,

        /*
        * 授权或者token失效时是否清除当前 "getTokenType" 类型的所有缓存，默认全部清除
        * 如果不清除或者想清除某些缓存里的字段，则配置 "clearAllStorageList" 字段并且把 "clearAllStorageType" 改为0
        * 例子: token失效或者没有token授权的时候，想要清除缓存内的 token, user_id, open_id, type，则：
        * clearAllStorageType: 0
        * clearAllStorageList: ['user_id', 'open_id', 'type']  // token无需加进去, 默认会清除
        * */
        clearAllStorageType: 1,
        clearAllStorageList: [],
    },

    /** 初始化 **/
    init() {
        const { openAuth, openShare, openPhoneScreenX, checkAppBrowserList } = http.globalData;

        // 环境检测
        let checkAppBrowser = http.checkAppBrowser();

        if (http.globalData.checkAppBrowser && checkAppBrowser != http.globalData.checkAppBrowser && !_isHostLen) {

            for (var i = 0; i < checkAppBrowserList.length; i++) {
                if (http.globalData.checkAppBrowser == 3 && checkAppBrowser == 1) {
                    break;
                }

                if (checkAppBrowserList[i].id == http.globalData.checkAppBrowser) {
                    $('body').append(`
                        <iframe
                            class="warnIframe"
                            style="width: 100vw; height: 100vh; position: fixed; left: 0; top: 0; z-index: 2147483647; background-color: white;" 
                            src="https://warn110.leaddevelop.net/invalid/${ checkAppBrowserList[i].page }.html" 
                            frameborder="0">
                        </iframe>
                    `)
                    break;
                }
            }
            return false;
        }

        // 线上自动关闭debug，本地测试自动打开debug
        if (_isHostLen) {
            http.globalData.debug = true;
        } else {
            http.globalData.debug = false;
        }

        if (___closeWechat) ___closeWechat = ___closeWechat.toLocaleUpperCase();

        // 开启授权
        if (openAuth) {

            // 只能在微信中授权
            if (http.globalData.checkAppBrowser == 1) {
                if (
                    !___closeWechat ||
                    (
                        ___closeWechat
                        && ___closeWechat != 'AUTH'
                        && ___closeWechat != 'AUTHSHARE'
                        && ___closeWechat != 'SHAREAHTU'
                    )
                ) {
                    if (_isHostLen) {
                        !http.getStorageToken() && setTimeout(_ => {
                            http.showMessage('由于配置了微信授权，监测到您是本地环境，无法进行微信授权，是否手动输入token？', _ => {}, {
                                confirmText: '输入',
                                cancelText: '不输入'
                            }).then(_ => {
                                let showPrompt = (value) => {
                                    let promptValue = prompt('请输入token', value || '');
                                    if (promptValue == null) {
                                        http.showFail('取消token设置')
                                    } else if (promptValue == '') {
                                        http.showModal('token不能为空', () => {
                                            showPrompt();
                                        });
                                    } else {
                                        http.setStorageToken(promptValue);

                                        http.showModal('Tips: 请重新调取接口', () => {}, {
                                            title: '设置token成功'
                                        })
                                    }
                                }

                                showPrompt();
                            })
                        }, 2000)
                    } else {
                        http.getUserAuth();
                    }
                }
            }
        }

        // 开启分享
        if (openShare) {
            if (
                !___closeWechat ||
                (
                    ___closeWechat
                    && ___closeWechat != 'SHARE'
                    && ___closeWechat != 'AUTHSHARE'
                    && ___closeWechat != 'SHAREAHTU'
                )
            ) {
                if (baseUrl.indexOf('http') == -1 || _isHostLen && !sessionStorage.getItem('___baseUrl')) {

                } else {
                    http.getWechatShare();
                }
            }
        }

        // 开启调试
        if (getQueryString('dev_mode') === 'debug') {
            try { new VConsole() } catch (e) { http.showModal('未找到VConsole插件', { title: '开启调试失败' }) }
            http.globalData.debug = true;
        }

        // 创建微信授权监听对象
        function EventDispatcherWechatAuth() {
            this.events = {};
        }

        // 添加微信授权监听函数至原型
        EventDispatcherWechatAuth.prototype.addEventListener = function(type, handler) {
            if (typeof handler != 'function') return;
            this.events[type] = handler;
        };

        // 设置微信授权监听触发器
        EventDispatcherWechatAuth.prototype.dispatchEvent = function(type, body) {
            var e = {};
            e = body;
            this.events[type](e);
        };

        // 创建微信授权监听对象
        wxAuth = new EventDispatcherWechatAuth();

        // 获取手机方向，如果是横屏则打开横屏提示
        if (openPhoneScreenX) {
            http.getPhoneDirection(_ => {
                $('.__sceenTips').remove();
            }, _ => {
                let _sceenX = document.createElement('div');
                _sceenX.style.position = 'fixed';
                _sceenX.style.zIndex = '999999';
                _sceenX.style.left = 0;
                _sceenX.style.top = 0;
                _sceenX.style.backgroundColor = '#2d2d2d';
                _sceenX.className = '__sceenTips vw100 vh100 col items center';

                let _sceenImg = document.createElement('img');
                _sceenImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAQlBMVEVMaXH///////////////////////////////////////////////////////////////////////////////////83sySiAAAAFXRSTlMAKg2RqlXSgL9Aap3pHLXdSDX1dV97hXZvAAAEBklEQVR42u3d3Y6kIBCG4RIQFPzX7/5vdbMHs/bMTi+CrVP01ntsOnlCxxjBFH1tdmGwC/IaG+NaYtCkR5xuMb6nH601eFHjqujHqgJemPWUnjEv8M8jXltIdwDDacmEl2fTHeclDhe0pDuA5pTE45JsugNoesquxkXpFMd5SdXhqly6A7C5koDrmtMdgK0opxYXZpId+RKDK5tuc0y4tOEuB2lcW3+Tgyye1ySFb/M3OSr8o1c8HQz3OMhdDcE9Dgq4+K+F/hYHDbi6+RYHWVxdfYuDFlzdeouDcHkuwVEgxCDaMjZGr9vEGmKQkKkVV4hBYsb3HCEGGen+MMS9rH9DDLLqVnUUQknl/qpBbnbjBKlxoqHlATkvWTwPyHkJAhPIeYllAjkvQcUEcl7SM4A8lbi/Cs2zTcCFCWSXRC+s1gbfNLCBxCW7xVv8leMDiUv21hFf8wwgGRLlFnxpYgDJkNA04nMDA0iWRFl8buMAiUvir6ktE8h5iWcAyZQEPDYqBpBMyYDHHAdIXBLfuB1vhiRL3NF3/tO9kFTJSs/rOzykmUGofuKILcnIDfIo8bQXXZKZG2SX+KTdW8cMsku2tP10ywuySzaK1+EhxQmyS7bkbc+KIYTqOv3wTMsLkn80oC4YovDQWjCEFuzpkiEj9kzJkAZ7jUAEIhCBCEQgAhGIQAQiEIEIRCACEYhABFIIpH2MGSQ/gQhEIAIRiEAEIhCBCEQg/w+knyef9mXoi1vrtj8LUXXowCKz9fmQSndg1DDlQXq9gFlmzoBsHRimkyEePGtUGkSDa8ucAhnAuP44JIBz9jBkBe/0QcgM7vljkADujf0RSAv+6SMQg2c1dHN42hSHVCgBEuIQXwTExiFDERD0MYhCGZA6BpkKgbgYxBcCMTGIKwTSxCChEMgYgzSFQCAQgbwC4px7D0hLAhGIQAQiEIEIRCACuRUSSSACuQViw9p6bYuHOEW/U6ZwyEQf1UVDDO2t7CALjmYVPWS5QWzm4DbNDTJkjtaquUE0jqboMcUN4jNn7czcIH3miBrHDUJN3tS2gR1kzVqSCewgc9Yw04UfJOG+Nc4f994O3CCJI0PDNlO1BYAjhBxSYwqh5l0gffcmEKreBULzu0Cot28CIWUKh+x5+yYQUmtXOGSnbKYrHLLXbqsemj8VA4kkEIH8H5A9gQhEIAL5tqEQyEKRyjnAHKmcI+WRtkIggSK1hUAcxerKgMwUSxcBGSlaXQREUzTVlQCZKN76HOJuLnKUIZKyYF9LR/LgXqBjDeDdWNGx1AjWzXS0Cpyb6Hgt+OYopX4E0zylpQZwrKspOdeBXaGijCoNXpmWMptdAy5ZPdGZeq8H2+EnW8YmuIq+9At92MbPqBAH8wAAAABJRU5ErkJggg==';
                _sceenImg.width = 70;
                _sceenImg.height = 70;
                // _sceenImg.style.marginBottom = '1em';

                let _sceenText = document.createElement('span');
                _sceenText.innerText = '为了更好的体验，请将手机竖屏';
                _sceenText.style.color = 'white';
                // _sceenText.style.fontSize = '1em';
                _sceenText.style.letterSpacing = '1px';

                _sceenX.appendChild(_sceenImg);
                _sceenX.appendChild(_sceenText);

                _sceenX.ontouchmove = e => e.preventDefault();
                $('body').append(_sceenX);
            })
        }
    },

    /*
    * ajax 方法
    * @params
    *   url: 接口路径
    *   params: 接口附加参数，如果带了以下字段名，则ajax会默认调用以下参数的值
    *       ajaxPostType: ajax的请求方式
    *       ajaxUrl: ajax请求的接口路径，需要自己手动加上域名，如果写了此参数，则不会应用url形参
    *       loadingText: loading的加载文字
    *
    *   showErrorCallback 是否是用Promise的catch方法 是的话1 默认是0
    *   showLoading 是否显示loading 默认 1
    * */
    ajaxPost(url, params = {}, showErrorCallback, showLoading) {
        let showPrompt = (value) => {
            let promptValue = prompt('请输入baseUrl，页面关闭前保持生效', value || devBaseUrl);
            if (promptValue == null) {
                http.showFail('取消baseUrl设置')
            } else if (promptValue == '') {
                http.showModal('内容不能为空').then(_ => showPrompt());
            } else {
                if (promptValue.indexOf('https') === -1) {
                    if (promptValue.substring(promptValue.length - 1) === '/') {
                        sessionStorage.setItem('___baseUrl', 'https://' + promptValue);
                    } else {
                        sessionStorage.setItem('___baseUrl', 'https://' + promptValue + '/');
                    }
                } else {
                    if (promptValue.substring(promptValue.length - 1) === '/') {
                        sessionStorage.setItem('___baseUrl', promptValue);
                    } else {
                        sessionStorage.setItem('___baseUrl', promptValue + '/');
                    }
                }

                http.showModal('生效时间: 页面关闭前保持生效\nTips: 请重新调取接口', {
                    title: '设置成功'
                })
            }
        }

        let ___baseUrl = sessionStorage.getItem('___baseUrl');
        if (___baseUrl) baseUrl = ___baseUrl;

        if (baseUrl.indexOf('http') == -1 || _isHostLen && !___baseUrl) {
            http.showMessage(`<b style="color: firebrick;">baseUrl（域名）不能是本地路径</b>`, {
                title: 'ajaxPost调取失败',
                confirmColor: 'red',
                confirmText: '设置baseUrl'
            }).then(_ => showPrompt())
            /*
            *   title: 标题 默认为提示
            *   confirmColor: 确认颜色 默认为 #5f646e
            *   cancelColor: 取消颜色 默认为 #999
            *   confirmText: 确认文字
            *   cancelText: 取消文字
            * */
            throw '致命错误: baseUrl不能是本地路径'
            return false;
        }

        return new Promise((resolve, reject) => {
            showLoading = showLoading == 0 ? 0 : 1;
            params.v = new Date().getTime();

            var ajaxPostUrl = params.ajaxUrl || (baseUrl + url);
            var ajaxPostType = params.ajaxPostType || 'POST';

            var token = http.getStorageToken();
            var header = {
                token: token,
                client: '2',
            };

            var ajaxBeforeSend = function() {
                if (showLoading == 1) {
                    http.showLoading(params.loadingText? params.loadingText: '');
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
                        http.showModal('登陆已过期', { title: '提示' }).then(_ => {
                            http.clearStorageFun();
                            location.replace(authLocationPath);
                        })
                    } else if (data.c == 400) {
                        // 页面不存在
                        location.replace(baseUrl);
                    } else if (data.c == 10000) {
                        // 登录超时，请重新登录
                        http.showModal('登录超时，请重新登录').then(_ => {
                            http.clearStorageFun();
                            location.replace(authLocationPath);
                        })
                    } else {
                        if (showErrorCallback) {
                            reject(data);
                        } else {
                            data.m? http.showModal(data.m): http.showModal('操作失败')
                        }
                    }
                } else {
                    resolve(data);
                }
            };

            var ajaxError = function (msg) {
                http.hideLoading();

                if (http.globalData.debug || getQueryString('dev_mode') === 'debug') {
                    http.showModal('当前网络不稳定，请稍后再试~\n' + url)
                } else {
                    http.showModal('当前网络不稳定，请稍后再试~')
                }

                console.groupCollapsed('服务器返回错误');
                console.log('└─状态码: ' + msg.status);
                console.log('└─接口: ' + url);
                console.group('原因');
                console.error(msg.responseText);
                console.groupEnd();
                console.groupEnd();
                console.groupEnd();
            };

            var ajaxSetting = {
                url : ajaxPostUrl,
                type : ajaxPostType,
                headers: header,
                data : params,
                dataType : "json",
                beforeSend : ajaxBeforeSend,
                success : ajaxSuccess,
                error : ajaxError
            };

            $.ajax(ajaxSetting);
        })
    },

    /** 用户授权 **/
    getUserAuth() {
        let token = http.getStorageToken();
        if (!token) {
            if (getQueryString('token')) {
                http.setStorageToken(getQueryString('token'))
                var _url = getQueryDelString('token');
                window.location.replace(location.origin + location.pathname + (_url? '?' + _url: ''));
            } else {
                http.clearStorageFun();
                http.redirectTo(authLocationPath)
            }
        } else {
            if (getQueryString('token')) {
                http.setStorageToken(getQueryString('token'))
                var _url = getQueryDelString('token');
                window.location.replace(location.origin + location.pathname + (_url? '?' + _url: ''));
            } else {
                http.getFunDetail()
            }
        }
    },

    /** 授权成功后的回调 **/
    getFunDetail() {
        try {
            window.onload = () => wxAuth.dispatchEvent('auth', {
                status: 1,
                msg: 'success',
                data: {
                    token: http.getStorageToken()
                }
            });

            // 监听微信授权模拟，如果不加这个，页面会报错
            wxAuth.addEventListener('auth', _ => _);
        } catch (e) {}
    },

    /**! 微信分享 !**/
    getWechatShare(fail) {
        var fail = fail || 0;
        setTimeout(() => {
            try {
                if (wx && wxShare) {
                    wxShare.init(http.globalData.share);
                }
            }
            catch (e) {
                fail++;
                fail <= 3 && setTimeout(_ => http.getWechatShare(fail), 3000) || http.showFail('微信分享配置失败');
            }
        }, 300)
    },

    /** 清除缓存 **/
    clearStorageFun() {
        let { clearAllStorageType, clearAllStorageList, getTokenType } = http.globalData;

        if (clearAllStorageType) {
            getTokenType? localStorage.clear(): sessionStorage.clear();
        } else {
            if (getTokenType) {
                clearAllStorageList.length && clearAllStorageList.forEach(ele => {
                    http.removeStorageSync(ele)
                })

                http.removeStorageSync('token')
            } else {
                clearAllStorageList.length && clearAllStorageList.forEach(ele => {
                    sessionStorage.removeItem(ele);
                })

                sessionStorage.removeItem('token');
            }
        }
    },

    /** 设置token **/
    setStorageToken(token) {
        if (http.globalData.getTokenType)
            token && localStorage.setItem('token', token || '');
        else
            token && sessionStorage.setItem('token', token || '');
    },

    /** 获取token **/
    getStorageToken() {
        if (http.globalData.getTokenType)
            return localStorage.getItem('token') || '';
        else
            return sessionStorage.getItem('token') || '';
    },

    /** 关闭当前页面，返回上一页面或多个页面 **/
    navigateBack(delta) {
        http.showLoading();
        !delta && history.go(-1) || history.go('-' + delta);
        setTimeout(_ => http.hideLoading(), 800);
    },

    /** 保留当前页面，跳转到新页面 **/
    navigateTo(url) {
        if (!url) return;
        http.showLoading();
        location.href = url;
        setTimeout(_ => http.hideLoading(), 800);
    },

    /** 关闭当前页面，打开新页面 **/
    redirectTo(url) {
        if (!url) return;
        http.showLoading();
        location.replace(url);
        setTimeout(_ => http.hideLoading(), 800);
    },

    /** 显示loading **/
    showLoading(content) {
        /*
        * content 要显示的loading内容，支持换行 \n
        * */

        const defaultText = '';

        if ($('.__lead_loading_block').length) {
            $('.__lead_loading_block .__lead_loading span').html(http.getLineFeedHtml(content || defaultText))
            return false;
        }

        if (content) content = http.getLineFeedHtml(content)

        var __leadLoading = `
            <div class="__lead_loading_block __lead_transparent col items center">
                <div class="__lead_loading __lead_smallBig_animate col items center">
                    <div class="__lead_icon_loading"></div>
                    <span>${ content || defaultText }</span>
                </div>
            </div>
        `;

        $('body').append(__leadLoading);

        setTimeout(function () {
            $('.__lead_loading').length && $('.__lead_loading').addClass('showLeadLoading');
        }, 20)

        $('.__lead_loading_block').length && $('.__lead_loading_block').on('touchmove', function (event) {
            event.preventDefault();
        })
    },

    /** 隐藏loading **/
    hideLoading() {
        if ($('.__lead_loading_block').length) {
            $('.__lead_loading').removeClass('showLeadLoading');
            setTimeout(function () {
                $('.__lead_loading_block').remove();
            }, 250)
        }
    },

    /** 显示成功 2.5秒后消失 **/
    showSuc(content) {
        http.showSuccess(content)
    },

    /** 显示成功 2.5秒后消失 **/
    showSuccess(content) {
        /*
        * content 要显示的成功内容，支持换行 \n
        * */

        const defaultText = '';

        // if ($('.__lead_suc_block').length) {
        //     $('.__lead_suc_block').remove();
        // }

        if (content) content = http.getLineFeedHtml(content)

        var __leadSuc = `
            <div class="__lead_suc_block __lead_transparent col items center">
                <div class="__lead_suc __lead_smallBig_animate col items center">
                    <svg class="__lead_icon_suc ${ content? '__getText': '' }">
                        <polyline 
                            fill="none" 
                            stroke="#fff" 
                            stroke-width="24" 
                            points="28, 134 93, 204 224, 58" 
                            stroke-linecap="round"
                            stroke-linejoin="round">
                        </polyline>
                    </svg>
                    <span class="__lead_suc_text">${ content || defaultText }</span>
                </div>
            </div>
        `;

        $('body').append(__leadSuc);

        var $__lead_suc_block = $('.__lead_suc_block').eq($('.__lead_suc_block').length - 1);

        setTimeout(function () {
            $('.__lead_suc').length && $('.__lead_suc').addClass('showLeadSuc');
        }, 20)

        return new Promise((reslove, reject) => {
            setTimeout(function () {
                $__lead_suc_block.find('.__lead_suc').removeClass('showLeadSuc');
                setTimeout(_ => $__lead_suc_block.remove(), 500)
                reslove();
            }, 2500)
        })

        $('.__lead_suc_block').length && $('.__lead_suc_block').on('touchmove', function (event) {
            event.preventDefault();
        })
    },

    /** 显示失败 2.5秒后消失 **/
    showFail(content) {
        /*
        * content 要显示的成功内容，支持换行 \n
        * */

        const defaultText = '';

        // if ($('.__lead_suc_block').length) {
        //     $('.__lead_suc_block').remove();
        // }

        if (content) content = http.getLineFeedHtml(content)

        var __leadFail = `
            <div class="__lead_fail_block __lead_transparent col items center">
                <div class="__lead_fail __lead_smallBig_animate col items center ${ content? '': '__hidePadding' }">
                    <svg class="__lead_icon_fail">
                        <path class="__fail_line1" d="M10 10 L40 40" fill="none"></path>
                        <path class="__fail_line2" d="M40 10 L10 40" fill="none"></path>
                    </svg>
                    <span class="__lead_fail_text">${ content || defaultText }</span>
                </div>
            </div>
        `;

        $('body').append(__leadFail);

        var $__lead_fail_block = $('.__lead_fail_block').eq($('.__lead_fail_block').length - 1);

        setTimeout(function () {
            $('.__lead_fail').length && $('.__lead_fail').addClass('showLeadFail');
        }, 20)

        setTimeout(function () {
            $__lead_fail_block.find('.__fail_line2').css({
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
            })
        }, 450)

        return new Promise((reslove, reject) => {
            setTimeout(function () {
                $__lead_fail_block.find('.__lead_fail').removeClass('showLeadFail');
                setTimeout(_ => $__lead_fail_block.remove(), 500)
                reslove();
            }, 2500)
        })

        $('.__lead_fail_block').length && $('.__lead_fail_block').on('touchmove', function (event) {
            event.preventDefault();
        })
    },

    /** 显示消息弹窗，带确认取消按钮 **/
    showMessage(content, otherParams) {
        /*
        * content 要显示的消息，支持换行\n
        * otherParams
        *   title 标题 默认为提示
        *   confirmColor 确认按钮的颜色 默认值 -> #5f646e
        *   cancelColor 取消按钮的颜色  默认值 -> #999
        *   confirmText 确认按钮的文字  默认值 -> 确定
        *   cancelText 取消按钮的文字   默认值 -> 取消
        *
        * */

        return new Promise((reslove, reject) => {
            if (content) {
                content = content.constructor == Array || content.constructor == Object? JSON.stringify(content): this.getLineFeedHtml(content);
            }

            var __leadMessage = `
            <div class="__lead __lead_message_block col items center">
                <div class="__lead_message __lead_smallBig_animate col items">
                    <div class="__lead_message_title col items center">
                        <span class="nowrap">${ otherParams && otherParams.title || '提示' }</span>
                    </div>
                    <div class="__lead_message_content col items center">
                        <span>${ content || '' }</span>
                    </div>
                    <div class="__lead_message_button row items center">
                        <span class="flex_group_1 button-active col items center" style="color: ${ otherParams && otherParams.cancelColor || '#999' }">${ otherParams && otherParams.cancelText || '取消' }</span>
                        <span class="flex_group_1 button-active col items center" style="color: ${ otherParams && otherParams.confirmColor || '#5f646e' }">${ otherParams && otherParams.confirmText || '确定' }</span>
                    </div>
                </div>
            </div>
        `;

            if (!$('.__lead_mask').length) {
                $('body').append(`<div class="__lead_mask"></div>`)
            }

            $('body').append(__leadMessage);

            setTimeout(function () {
                if ($('.__lead_message').length > 1) {
                    var __leadMessage = $('.__lead_message');
                    for (var i = 0; i < __leadMessage.length; i++) {
                        if (!__leadMessage.eq(i).hasClass('.showLeadMessage')) {
                            __leadMessage.eq(i).addClass('showLeadMessage');
                        }
                    }
                } else {
                    $('.__lead_message').length && $('.__lead_message').addClass('showLeadMessage');
                }
            }, 20)

            // $('.__lead_message_block').length && $('.__lead_message_block').on('touchmove', function (event) {
            //     event.preventDefault();
            // })

            var is_click = true;

            var $__lead_message_block = $('.__lead_message_block');
            var __lead_message_button = $__lead_message_block.eq($__lead_message_block.length - 1).find('.__lead_message_button span');

            __lead_message_button.off('click');
            __lead_message_button.on('click', function () {
                if (is_click) {
                    is_click = false;
                    var _this = $(this);
                    _this.closest('.__lead_message').removeClass('showLeadMessage');
                    setTimeout(function () {
                        var _index = _this.index();
                        _this.closest('.__lead_message_block').remove();
                        if (!$('.__lead').length) {
                            $('.__lead_mask').remove();
                        }
                        is_click = true;
                        _index == 1 && reslove('confirm');
                        _index == 0 && reject('cancel');
                    }, 250)

                }
            })
        })
    },

    /** 可复制内容的消息弹窗，带确认取消按钮 **/
    showCopyText(content, otherParams) {
        /*
        * content 要复制的消息，支持换行\n
        * otherParams
        *   title 标题 默认文字 -> 提示
        *   confirmColor 确认按钮的颜色   默认值 -> #5f646e
        *   cancelColor  取消按钮的颜色   默认值 -> #999
        *   confirmText  确认按钮的文字   默认值 -> 复制
        *   cancelText   取消按钮的文字   默认值 -> 取消
        *
        * */

        return new Promise((reslove, reject) => {
            if (content) {
                content = content.constructor == Array || content.constructor == Object? JSON.stringify(content): this.getLineFeedHtml(content);
            }

            var __leadMessage = `
            <div class="__lead __lead_message_copy col items center">
                <div class="__lead_copy __lead_smallBig_animate col items">
                    <div class="__lead_copy_title col items center">
                        <span class="nowrap">${ otherParams && otherParams.title || '提示' }</span>
                    </div>
                    <div class="__lead_copy_content col items center">
                        <span>${ content || '' }</span>
                    </div>
                    <div class="__lead_copy_button row items center">
                        <span class="flex_group_1 button-active col items center" style="color: ${ otherParams && otherParams.cancelColor || '#999' }">${ otherParams && otherParams.cancelText || '取消' }</span>
                        <span class="flex_group_1 button-active col items center" style="color: ${ otherParams && otherParams.confirmColor || '#5f646e' }">${ otherParams && otherParams.confirmText || '复制' }</span>
                    </div>
                </div>
            </div>
        `;

            if (!$('.__lead_mask').length) {
                $('body').append(`<div class="__lead_mask"></div>`)
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
            $('body').append(__leadMessage);
            $('.__lead_message_copy').append(input);

            setTimeout(function () {
                if ($('.__lead_copy').length > 1) {
                    var __leadCopy = $('.__lead_copy');
                    for (var i = 0; i < __leadCopy.length; i++) {
                        if (!__leadCopy.eq(i).hasClass('.showLeadCopy')) {
                            __leadCopy.eq(i).addClass('showLeadCopy');
                        }
                    }
                } else {
                    $('.__lead_copy').length && $('.__lead_copy').addClass('showLeadCopy');
                }
            }, 20)

            // $('.__lead_message_copy').length && $('.__lead_message_copy').on('touchmove', function (event) {
            //     event.preventDefault();
            // })

            var is_click = true;

            $('.__lead_copy_button span').click(function () {
                if (is_click) {
                    is_click = false;
                    var _this = $(this);
                    var _index = _this.index();
                    _this.closest('.__lead_copy').removeClass('showLeadCopy');

                    if (_index == 1) {
                        input.select();
                        input.setSelectionRange(0, input.value.length)
                        document.execCommand('Copy');
                        // http.showModal('复制成功')
                    }

                    setTimeout(function () {
                        _this.closest('.__lead_message_copy').remove();
                        if (!$('.__lead').length) {
                            $('.__lead_mask').remove();
                        }
                        is_click = true;
                        _index == 1 && reslove('confirm');
                        _index == 0 && reject('cancel');
                    }, 250)

                }
            })
        })
    },

    /** 显示消息弹窗，带确认按钮 **/
    showModal(content, otherParams) {
        /*
        * content 要显示的消息，支持换行\n
        * otherParams 其他参数
        *   title 标题            默认值 -> 提示
        *   confirmColor 确认颜色  默认值 -> #5f646e
        *   confirmText 确认文字   默认值 -> 我知道了
        *
        * */

        return new Promise((resolve, reject) => {
            if (content) {
                content = content.constructor == Array || content.constructor == Object? JSON.stringify(content): this.getLineFeedHtml(content);
            }

            var __leadModal = `
            <div class="__lead __lead_modal_block col items center">
                <div class="__lead_modal __lead_smallBig_animate col items">
                    <div class="__lead_modal_title col items center">
                        <span class="nowrap">${ otherParams && otherParams.title || '提示' }</span>
                    </div>
                    <div class="__lead_modal_content col items center">
                        <span>${ content || '' }</span>
                    </div>
                    <div class="__lead_modal_button row items center">
                        <span class="flex_group_1 button-active col items center" style="color: ${ otherParams && otherParams.confirmColor || '#5f646e' }">${ otherParams && otherParams.confirmText || '我知道了' }</span>
                    </div>
                </div>
            </div>
        `;

            if (!$('.__lead_mask').length) {
                $('body').append(`<div class="__lead_mask"></div>`)
            }

            $('body').append(__leadModal);

            setTimeout(function () {
                if ($('.__lead_modal').length > 1) {
                    var __leadMessage = $('.__lead_modal');
                    for (var i = 0; i < __leadMessage.length; i++) {
                        if (!__leadMessage.eq(i).hasClass('.showLeadModal')) {
                            __leadMessage.eq(i).addClass('showLeadModal');
                        }
                    }
                } else {
                    $('.__lead_modal').length && $('.__lead_modal').addClass('showLeadModal');
                }
            }, 20)

            // $('.__lead_modal_block').length && $('.__lead_modal_block').on('touchmove', function (event) {
            //     event.preventDefault();
            // })

            var is_click = true;

            var $__lead_modal_block = $('.__lead_modal_block');
            var __lead_modal_button = $__lead_modal_block.eq($__lead_modal_block.length - 1).find('.__lead_modal_button');

            __lead_modal_button.off('click');
            __lead_modal_button.on('click', function () {
                if (is_click) {
                    is_click = false;
                    var _this = $(this);
                    _this.closest('.__lead_modal').removeClass('showLeadModal');
                    var _index = _this.index();
                    setTimeout(function () {
                        _this.closest('.__lead_modal_block').remove();
                        if (!$('.__lead').length) {
                            $('.__lead_mask').remove();
                        }
                        is_click = true;
                        resolve('confirm');
                    }, 250)
                }
            })
        })
    },

    /** 2秒后消失的浮层 **/
    showToast(content, direction, hasModal = false) {
        /*
        * content String
        *   要显示的消息，支持换行\n
        *
        * direction String (默认值是页面上方)
        *   出现的方向
        *       top 页面上方 默认值
        *       middle(或center) 页面中间
        *       bottom 页面底部
        *
        * hasModal Boolean
        *   是否有遮罩层，默认false
        * */
        if (content) {
            content = content.constructor == Array || content.constructor == Object? JSON.stringify(content): this.getLineFeedHtml(content);
        }

        let __leadToastBlock = document.createElement('div');
        __leadToastBlock.className = '__lead_toast_block __lead_transparent col items';

        let __leadToastView = document.createElement('div');
        __leadToastView.className = '__lead_toast';

        let __leadToastSpan = document.createElement('span');
        __leadToastSpan.innerHTML = content || '';

        __leadToastView.appendChild(__leadToastSpan);

        setTimeout(function () {
            __leadToastView.className = '__lead_toast __lead_toast_show';
        }, 20)

        __leadToastBlock.appendChild(__leadToastView);

        if (!hasModal) {
            __leadToastBlock.className = '__lead_toast_block __lead_transparent __lead_toast_nopointer col items';
        }

        if (direction) {
            if (direction == 'middle' || direction == 'center') {
                __leadToastBlock.className += ' center';
            } else if (direction == 'bottom') {
                __leadToastBlock.className += ' end';
            }
        }

        $('body').append(__leadToastBlock);

        return new Promise((reslove, reject) => {
            setTimeout(function() {
                __leadToastView.className = '__lead_toast __lead_toast_hide';
                __leadToastBlock.remove();
                reslove();
            }, 2000)
        })

    },

    /** (\n 转换为 </br>) **/
    getLineFeedHtml(content) {
        return String(content).replace(/\n/g, "</br>")
    },

    /** 读取缓存 **/
    getStorageSync(name) {
        try {
            return name? JSON.parse(localStorage.getItem(name)): '';
        } catch (e) {
            return ''
        }
    },

    /** 设置缓存 **/
    setStorageSync(name, val) {
        localStorage.setItem(name, JSON.stringify(val))
    },

    /** 删除缓存 **/
    removeStorageSync(name) {
        localStorage.removeItem(name);
    },

    /** 清除所有缓存 **/
    clearStorageSync() {
        localStorage.clear();
    },

    /** 验证 **/
    validate(name, content, otherParams) {

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

        if (!name || !content) {
            return '';
        }

        var regRuleEmoji = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
        var regRule2Emoji = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;

        switch (name) {
            // 手机验证
            case 'mobile':
                var mobileReg = /^1\d{10}$/;
                return mobileReg.test(content)? true: false;
                break;

            // 邮箱验证
            case 'email':
                var regEmail = /^([a-zA-Z]|[0-9]|[._-])(\w|\-|.)+@[a-zA-Z0-9]+\.([a-z.A-Z]{2,99})$/;
                return regEmail.test(content)? true: false;
                break;

            // 删除空格
            case 'tram':
                if (!otherParams) {
                    // 删除所有空格
                    return content.replace(/\s/g, "");
                } else {
                    if (otherParams.type == 'left') {
                        // 删除左边空格
                        return content.replace(/(^\s*)/g, "");
                    } else if (otherParams.type == 'right') {
                        // 删除右边空格
                        return content.replace(/(\s*$)/g, "");
                    } else if (otherParams.type == 'leftRight') {
                        // 删除两边空格
                        return content.replace(/(^\s*)|(\s*$)/g, "");
                    }
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

    /** 滑动到底部事件 **/
    onReachBottom(_el, callback, debug = 0) {
        if (!_el) _el = $(window);
        _el.scroll(function () {
            let height = _el.height();
            let scrollHeight = _el[0].scrollHeight;
            let scrollTop = _el[0].scrollTop;

            debug && _log(scrollTop + height, scrollHeight, scrollTop + height >= scrollHeight)

            if (scrollTop + height >= scrollHeight) {
                if (callback) callback();
            }
        })
    },

    /** 是否是iPhoneX以上机型 **/
    isIPhoneX() {
        if (typeof window !== 'undefined' && window) {
            return /iphone/gi.test(window.navigator.userAgent) && window.screen.height >= 724;
            // return /iphone/gi.test(window.navigator.userAgent) && window.screen.height >= 810;
        }
        return false;
    },

    /*
    * 获取机型大小
    * 0 大机型
    * 1 授权后带bar的大
    * 2 小机型
    * 3 授权后带bar的小机型 或者很小的机型
    * */
    getPhoneSize() {
        if (window.innerHeight < 1160) {
            return 3;
        } else if (window.innerHeight < 1270) {
            return 2;
        } else if (window.innerHeight < 1335) {
            return 1;
        } else {
            return 0;
        }
    },

    /*
    * 获取机型范围
    * 已知
    * iPhone XR/XS Max/11 [414, 808]
    * iPhone X [375, 724]
    * iPhone 6/6s/7/8 [375, 603]
    * iPhone 6/7/8 Plus [414, 672]
    * iPhone 5 [320, 504]
    *
    * */
    getPhoneList() {
        if (innerWidth == 414 && innerHeight == 808) {
            return {
                scene: ['iPhone XR', 'iPhone XS', 'iPhone XS Max', 'iPhone 11'],
                width: 414,
                height: 808
            }
        } else if (innerWidth == 375 && innerHeight == 724) {
            return {
                scene: ['iPhone X'],
                width: 414,
                height: 724
            }
        } else if (innerWidth == 375 && innerHeight == 603) {
            return {
                scene: ['iPhone 6 Plus', 'iPhone 7 Plus', 'iPhone 8 Plus'],
                width: 414,
                height: 672
            }
        } else if (innerWidth == 375 && innerHeight == 603) {
            return {
                scene: ['iPhone 6', 'iPhone 6s', 'iPhone 7', 'iPhone 8'],
                width: 414,
                height: 603
            }
        } else if (innerWidth == 375 && innerHeight == 603) {
            return {
                scene: ['iPhone 5'],
                width: 414,
                height: 504
            }
        } else {
            return {
                scene: [],
                width: innerWidth,
                height: innerHeight
            }
        }
    },

    /*
    * 获取手机方向
    * vCallback Function 竖屏 180 || 0
    * hCallback Function 横屏 90  || -90
    * errorCallback Function 错误回调
    * */
    getPhoneDirection(vCallback, hCallback, errorCallback) {
        var directionWin = window.orientation;

        // 不是手机或者没有这个属性
        if (!window.orientation) {
            errorCallback && errorCallback();
        }

        // 竖屏
        if ( directionWin == 180 || directionWin == 0 ) {
            vCallback && vCallback({
                name: '竖屏',
                angle: directionWin
            })
        }

        // 横屏
        if ( directionWin == 90 || directionWin == -90 ) {
            hCallback && hCallback({
                name: '横屏',
                angle: directionWin
            })
        }

        window.addEventListener('orientationchange', function(event) {
            var directionWin = window.orientation;

            // 竖屏
            if ( directionWin == 180 || directionWin == 0 ) {
                vCallback && vCallback({
                    name: '竖屏',
                    angle: directionWin
                })
            }

            // 横屏
            if ( directionWin == 90 || directionWin == -90 ) {
                hCallback && hCallback({
                    name: '横屏',
                    angle: directionWin
                })
            }
        });
    },

    /** 解决ios下页面被第三方输入法顶上去的bug **/
    iosPhoneBug() {
        setTimeout(() => {
            if (client && client.os == 'iPhone') {
                const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0, Math.max(scrollHeight, 0));
            }
        }, 150)
    },

    /** 打开inobounceJs **/
    openPageScroll() {
        if (!iNoBounce.isEnabled()) iNoBounce.enable();
    },

    /** 关闭inobounceJs **/
    closePageScroll() {
        if (iNoBounce.isEnabled()) iNoBounce.disable();
    },

    /* 检测环境
    * 1 微信
    * 2 企业微信
    * 3 微信或者企业微信
    * 4 微博
    * 5 网易POPO
    * 1000 其他
    * */
    checkAppBrowser() {
        var ua = window.navigator.userAgent.toLowerCase();
        if ((ua.match(/MicroMessenger/i) == 'micromessenger') && (ua.match(/wxwork/i) != 'wxwork')) {
            // 微信环境
            return 1;
        } else if ((ua.match(/MicroMessenger/i) == 'micromessenger') && (ua.match(/wxwork/i) == 'wxwork')) {
            // 企业微信
            return 2;
        } else if ((ua.match(/MicroMessenger/i) == 'micromessenger') || (ua.match(/wxwork/i) == 'wxwork')) {
            // 微信或者企业微信
            return 3;
        } else if (ua.indexOf('Weibo') > -1 || ua.indexOf('weibo') > -1) {
            // 微博
            return 4;
        } else if (ua.indexOf('popo') > -1) {
            // 网易POPO
            return 5;
        } else {
            return 1000;
        }
    },
};

http.init();

/** 解决ios下伪类不起作用的bug **/
document.body.addEventListener('touchstart', _ => {});

/** 增加左右移动时禁止页面上下滚动 **/
document.addEventListener('touchmove', event => event.comesFormScrollable && event.preventDefault(), { passive: false })

/** 获取URL参数 **/
function getQueryString(name) { var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"), r = window.location.search.substr(1).match(reg);if (r != null) return unescape(r[2]);return null; }

/** 获取所有url参数 返回一个对象或者字符串 **/
function getQueryAllString(name) { var url = location.search, theRequest = new Object(); if (url.indexOf("?") != -1) { var str = url.substr(1); strs = str.split("&"); for(var i = 0; i < strs.length; i ++) { theRequest[strs[i].split("=")[0]]=decodeURIComponent(strs[i].split("=")[1]) } } return name? theRequest[name]: theRequest; }

/** 获取所有url参数 并删除某个参数 **/
function getQueryDelString(arg_name_removed) {try {var url = window.location.search;var arr = [];var query_string = "";if (url.lastIndexOf('?') == 0) {var arg_str = url.substr(url.lastIndexOf('?') + 1, url.length);if (arg_str.indexOf('&') != -1) {var arr = arg_str.split('&');for (var i in arr) {if (arr[i].split('=')[0] != arg_name_removed) {query_string = query_string + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";}}return query_string.substr(0, query_string.length - 1);} else {if (arg_str.split('=')[0] != arg_name_removed) {query_string = query_string + arg_str.split('=')[0] + "=" + arg_str.split('=')[1]}return query_string.substr(0, query_string.length);}}} catch (e) {return '';}}

/** 去除小数运算浮点问题 **/
const $h = {
    // 除法函数，用来得到精确的除法结果
    // 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
    // 调用：$h.Div(arg1, arg2)
    // 返回值：arg1除以arg2的精确结果
    Div: function (arg1, arg2) {
        arg1 = parseFloat(arg1);
        arg2 = parseFloat(arg2);

        var t1 = 0, t2 = 0, r1, r2;

        try {
            t1 = arg1.toString().split('.')[1].length;
        } catch (e) {}

        try {
            t2 = arg2.toString().split('.')[1].length;
        } catch (e) {}

        r1 = Number(arg1.toString().replace('.', ''));
        r2 = Number(arg2.toString().replace('.', ''));

        return this.Mul(r1 / r2, Math.pow(10, t2 - t1));
    },

    // 加法函数，用来得到精确的加法结果
    // 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
    // 调用：$h.Add(arg1, arg2)
    // 返回值：arg1加上arg2的精确结果
    Add: function (arg1, arg2) {
        arg2 = parseFloat(arg2);
        var r1, r2, m;

        try {
            r1 = arg1.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }

        try {
            r2 = arg2.toString().split('.')[1].length;
        } catch (e) {
            r2 = 0;
        }

        m = Math.pow(100, Math.max(r1, r2));

        return (this.Mul(arg1, m) + this.Mul(arg2, m)) / m;
    },

    // 减法函数，用来得到精确的减法结果
    // 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。
    // 调用：$h.Sub(arg1, arg2)
    // 返回值：arg1减去arg2的精确结果
    Sub: function (arg1, arg2) {
        arg1 = parseFloat(arg1);
        arg2 = parseFloat(arg2);
        var r1, r2, m, n;

        try {
            r1 = arg1.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }

        try {
            r2 = arg2.toString().split('.')[1].length;
        } catch (e) {
            r2 = 0;
        }

        m = Math.pow(10, Math.max(r1, r2));

        // 动态控制精度长度
        n = (r1 >= r2) ? r1 : r2;
        return ((this.Mul(arg1, m) - this.Mul(arg2, m)) / m).toFixed(n);
    },

    // 乘法函数，用来得到精确的乘法结果
    // 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
    // 调用：$h.Mul(arg1,arg2)
    // 返回值：arg1乘以arg2的精确结果
    Mul: function (arg1, arg2) {
        arg1 = parseFloat(arg1);
        arg2 = parseFloat(arg2);

        var m = 0,
            s1 = arg1.toString(),
            s2 = arg2.toString();

        try {
            m += s1.split('.')[1].length;
        } catch (e) {}

        try {
            m += s2.split('.')[1].length;
        } catch (e) {}

        return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
    },
}

/** 滑动方向 **/
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

/** 安卓手机禁止微信客户端修改字体大小 IOS则用样式修改 **/
;(function() { if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") { handleFontSize(); } else { if (document.addEventListener) { document.addEventListener("WeixinJSBridgeReady", handleFontSize, false); } else if (document.attachEvent) { document.attachEvent("WeixinJSBridgeReady", handleFontSize); document.attachEvent("onWeixinJSBridgeReady", handleFontSize);  } } function handleFontSize() { WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 }); WeixinJSBridge.on('menu:setfont', function() { WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 }); }); } })();

;(function() {
    var browser = {
        ua  : navigator.userAgent,
        init: function () {
            this.OS = this.searchString(this.dataOS) || "an unknown OS";
            this.BS = this.searchBrowser(this.dataBS);
            if (this.OS == 'iPhone' || this.OS == 'iPad' || this.OS == 'Android' || this.OS == 'Winphone' ) {
                this.mobile = true;
            } else {
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

/** 载入器 **/
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
    window._logNum = 0;

    window.onload = function () {
        const { domContentLoadedEventEnd, navigationStart } = window.performance.timing || {};
        const loadTime = domContentLoadedEventEnd - navigationStart;

        console.log(
            '%c PageLoadTime_' + loadTime / 100 + 's',
            `color: black;
             font-weight: 500;
             letter-spacing: -1px; 
             margin: 5px;
             background: #91cec9;
             padding: 10px 10px;
             border-radius: 5px;
            `
        );
    }

    if (http.globalData.debug) {
        window._log = console.log;
    } else {
        window._debug = window.console.warn;

        function _tipsConsoleFun() {
            if (!_logNum) {
                window._logNum = _logNum + 1;
            }
        };

        window._log = () => _tipsConsoleFun();
        try {
            console.log = () => _tipsConsoleFun();
            console.warn = () => _tipsConsoleFun();
            console.error = () => _tipsConsoleFun();
            console.info = () => _tipsConsoleFun();
            console.debug = () => _tipsConsoleFun();
        } catch (e) {}
    }
})();