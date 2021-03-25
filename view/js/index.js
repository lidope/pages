var main = new Vue({
    el: '#main',
    data: {

    },

    mounted() {
        // 监听微信授权成功
        document.addEventListener('wechatAuth', _ => {
            this.getDetail();
        });
    },

    methods: {
        getDetail() {

        },
    }
});