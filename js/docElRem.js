/*
var a = document.documentElement.style.fontSize;
var b = window.getComputedStyle(document.documentElement)["font-size"];
var c = Number(b.split('px')[0]) - Number(a.split('px')[0])
*/
/*
* 已知华为Note10机型计算后，b与a的容差大于1导致rem计算值误差较大。
* */
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if (clientWidth >= 750) {
                docEl.style.fontSize = '100px';
            } else {
                docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
            }
            var html = document.getElementsByTagName('html')[0]
            var settingFs = parseInt(100 * (clientWidth / 750))
            var settedFs = settingFs
            var whileCount = 0
            while (true) {
                var realFs = parseInt(window.getComputedStyle(html).fontSize)
                var delta = realFs - settedFs
                // 不相等
                if (Math.abs(delta) >= 1) {
                    // alert('容错值' + delta);
                    if (delta > 0) {
                        settingFs--
                    } else {
                        settingFs++
                    }
                    html.setAttribute('style', 'font-size:' + settingFs + 'px!important')
                } else {
                    break
                }
                if (whileCount++ > 100) {
                    break
                }
            }
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);