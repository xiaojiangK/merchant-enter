import { post } from '../../utils/utils.js'

Page({
    data: {
        id: '',
        user: '',
        error: '',
        popup: {
            icon: 'icon-success',
            title: ''
        }
    },
    onLoad(opt) {
        this.setData({
            id: opt.id,
            user: opt.user
        });
    },
    formSubmit(e) {
        var id = this.data.id;
        var password = e.detail.value.password;
        var repassword = e.detail.value.repassword;
        if (!password || !repassword) {
            this.setData({
            error: '密码不能为空！'
            });
            return;
        } else {
            this.setData({
                error: ''
            });
        }
        if (password != repassword) {
            this.setData({
                error: '两次密码不一致！'
            });
            return;
        }
        post('v1_sign/Password', { id, password, repassword }).then(res => {
            if (res.code == 200) {
                this.setData({
                    "popup.icon": 'icon-success',
                    "popup.title": res.msg
                });
                setTimeout(() => {
                    wx.navigateBack({
                        delta: 1
                    });
                }, 1500);
            } else {
                this.setData({
                    "popup.icon": 'icon-error',
                    "popup.title": res.msg
                });
                setTimeout(() => {
                    this.setData({
                        "popup.title": ''
                    });
                }, 1500);
            }
        });
    }
});