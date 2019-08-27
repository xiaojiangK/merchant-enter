
import { post } from '../../utils/utils.js';
var app = getApp();

Page({
    data: {
        userInfo: {},
        companyList: []
    },
    onPullDownRefresh() {
        this.getUser();
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
                            wx.navigateTo({
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
    changePass() {
        var user = this.data.userInfo;
        wx.navigateTo({
            url: `/pages/changePass/index?user=${user.username}&id=${user.id}`
        });
    },
    getUser() {
        post('v1_user/info', {
            page: 1,
            id: app.globalData.user.uid
        }, `renren ${app.globalData.user.Authorization}`).then(res => {
            if (res.code == 200) {
                this.setData({
                    userInfo: res.userinfo.length && res.userinfo[0],
                    companyList: res.data.list
                });
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                });
            }
        });
    },
    onLoad() {
        this.getUser();
    }
});