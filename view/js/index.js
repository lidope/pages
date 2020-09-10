var main = new Vue({
    el: '#main',
    data: {

    },

    mounted() {
        // 监听微信授权成功
        wxAuth.addEventListener('auth', e => {
            _log(e)
            this.getDetail();
        })
    },

    methods: {
        getDetail() {

        },
    }
});