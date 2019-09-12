
import { post } from '../../utils/utils.js';
var app = getApp();

Page({
    data: {
        page: 1,
        userInfo: {},
        companyList: []
    },
    onPullDownRefresh() {
        this.setData({
            page: 1,
            companyList: []
        });
        this.getUser();
    },
    onReachBottom() {
        this.getUser(++this.data.page);
    },
    logout() {
        wx.showModal({
            content: '是否要退出登录？',
            cancelText: '取消',
            confirmText: '确定',
            success: (result) => {
                if(result.confirm){
                    post('v1_sign/quit', {}, `renren ${app.globalData.user.Authorization}`).then(res => {
                        if (res.code == 200) {
                            wx.showToast({
                                title: res.msg,
                                icon: 'none'
                            });
                            wx.removeStorage({
                                key: 'user'
                            });
                            wx.redirectTo({
                                url: '/pages/login/index'
                            });
                        } else {
                            wx.showToast({
                                title: res.msg,
                                icon: 'none'
                            });
                        }
                    });
                }
            }
        });
    },
    goApply(e) {
        var item = e.currentTarget.dataset.item;
        if (item.gf == -1 && item.ws == -1) {
            wx.navigateTo({
                url: `/pages/selectApply/index?id=${item.id}`
            });
        } else {
            wx.navigateTo({
                url: `/pages/apply/index?id=${item.id}`
            });
        }
    },
    changePass() {
        var user = this.data.userInfo;
        wx.navigateTo({
            url: `/pages/changePass/index?user=${user.username}&id=${user.id}`
        });
    },
    getUser(page = 1) {
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        post('v1_user/info', {
            page,
            id: app.globalData.user.uid
        }, `renren ${app.globalData.user.Authorization}`).then(res => {
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
                var oldData = this.data.companyList;
                var newData = res.data.list;
                if (newData.length == 0) {
                    wx.showToast({
                        title: '没有更多数据',
                        icon: 'none'
                    });
                    return;
                }
                this.setData({
                    userInfo: res.userinfo.length && res.userinfo[0],
                    companyList: [...oldData, ...newData]
                });
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                });
            }
            wx.hideLoading();
        });
    },
    onLoad() {
        this.setData({
            page: 1,
            companyList: []
        });
        this.getUser();
    },
    onShow() {
        this.setData({
            page: 1,
            companyList: []
        });
        this.getUser();
    },
    goBack() {
        wx.navigateTo({
            url: '/pages/selection/index'
        });
    }
});