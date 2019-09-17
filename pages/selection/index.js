import { post } from '../../utils/utils.js';
const config = require('../../config/index');
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
    },
    pay() {
        wx.login({
            success: (res) => {
                if (res.code) {
                    post('v1_sign/loginin', { code: res.code }, `renren ${app.globalData.user.Authorization}`).then(res => {
                        wx.request({
                            url: config.payBaseURL + '1/smallprogram/programpay',
                            data: {
                                total_money: 0.01,
                                openid: res.data.openid
                            },
                            header: {
                                Authorization: `renren ${app.globalData.user.Authorization}`,
                                'content-type': 'application/x-www-form-urlencoded',
                            },
                            method: 'POST',
                            success: (res)=>{
                                var data = res.data;
                                wx.requestPayment({
                                    timeStamp: data.timeStamp,
                                    nonceStr: data.nonceStr,
                                    package: data.package,
                                    signType: data.signType,
                                    paySign: data.paySign,
                                    success: (res)=>{
                                        wx.showToast({
                                            title: res.msg,
                                            icon: 'none'
                                        });
                                    },
                                    fail: (res)=>{
                                        wx.showToast({
                                            title: res.msg,
                                            icon: 'none'
                                        });
                                    }
                                });
                            }
                        });
                        // post('1/pay/programpay', { total_money: 0.01, openid: res.data.openid }, `renren ${app.globalData.user.Authorization}`).then(res => {

                        // });
                    });
                }
            }
        });
    }
});