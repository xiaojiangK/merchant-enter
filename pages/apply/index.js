
import { post } from '../../utils/utils.js';
var app = getApp();

Page({
    data: {
        id: "",
        url: '',
        list: [],
        isBack: 0,
        applyId: '',
        navTitle: '审核详情'
    },
    onLoad(opt) {
        this.setData({
            id: opt.id,
            isBack: opt.isBack ? opt.isBack : '',
            applyId: opt.applyId ? opt.applyId : ''
        });
        post('v1_entry/List', { id: this.data.id }, `renren ${app.globalData.user.Authorization}`).then(res => {
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
                var list = res.data.map(item => {
                    var type = -1;
                    var status = -1;
                    var statusText = '';
                    var channels = JSON.parse(item.channels);
                    if (item.pay_ment == 1) {
                        type = 'official';
                    } else {
                        type = 'network';
                    }
                    if (item.status	== 0 || item.status	== 2 || item.status	== 3) {
                        status = 1;
                        statusText = '审核中';
                    } else if (item.status == 4 || item.status == 5) {
                        status = 2;
                        statusText = '审核驳回';
                    } else {
                        statusText = '审核通过';
                    }
                    return {
                        ...item,
                        channels,
                        statusText,
                        url: `/pages/applyResult/index?status=${status}&type=${type}&id=${this.data.id}&wx=${channels.wx}&zfb=${channels.ali}&applyId=${item.id}`
                    };
                });
                this.setData({ list });
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                });
            }
        });
    },
    toSelect() {
        wx.navigateTo({
            url: `/pages/selectApply/index?id=${this.data.id}`
        });
    },
    // 监听返回
    goBack() {
        // 是否结果页进入，需返回
        if (this.data.isBack == 1) {
            var pages = getCurrentPages();
            wx.getStorage({
                key: 'user',
                success: (res)=>{
                    if (res.data.is_proxy == 0) {
                        wx.redirectTo({
                            url: `/${pages[0].route}`
                        });
                    } else {
                        wx.redirectTo({
                            url: `/${pages[1].route}`
                        });
                    }
                }
            });
        } else {
            wx.navigateBack({
                delta: 1
            });
        }
    }
});