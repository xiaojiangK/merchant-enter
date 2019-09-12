import { post } from '../../utils/utils.js';
var app = getApp();
var flag = true;

Page({
    data: {
        user: {}
    },
    onShow() {
        flag = true;
        wx.hideLoading();
    },
    onLoad() {
        wx.getStorage({
            key: 'user',
            success: (res) => {
                if (res.data.Authorization) {
                    this.setData({
                        user: res.data
                    });
                    app.globalData.user = res.data
                } else {
                    wx.redirectTo({
                        url: '/pages/login/index'
                    });
                }
            },
            fail: ()=>{
                wx.redirectTo({
                    url: '/pages/login/index'
                });
            }
        });
    },
    next() {
        if (flag) {
            flag = false;
            wx.showLoading({
                title: '加载中...',
                mask: true
            });
            var user = this.data.user;
            if (user.is_proxy == 1) {
                wx.navigateTo({
                    url: '/pages/company/index'
                });
            } else if (user.is_proxy == 0) {
                post('v1_entry/List', { id: user.uid }, `renren ${app.globalData.user.Authorization}`).then(res => {
                    var data = res.data;
                    if (res.code == 100002) {
                        wx.showToast({
                            title: '授权已过期，请重新授权',
                            icon: 'none'
                        });
                        wx.removeStorage({
                            key: 'user'
                        });
                        app.globalData.user = {};
                        wx.redirectTo({
                            url: '/pages/login/index'
                        });
                        return;
                    }
                    if (res.code == 200) {
                        if (data.length) {
                            wx.navigateTo({
                                url: `/pages/apply/index?id=${user.uid}`
                            });
                        } else {
                            wx.navigateTo({
                                url: `/pages/selectApply/index?id=${user.uid}`
                            });
                        }
                        return;
                    } else {
                        wx.showToast({
                            title: res.msg,
                            icon: 'none'
                        });
                    }
                    flag = true;
                });
            }
        }
    }
});