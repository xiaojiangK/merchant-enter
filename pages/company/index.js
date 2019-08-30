
import { post } from '../../utils/utils.js';
var app = getApp();

Page({
    data: {
        page: 1,
        userInfo: {},
        companyList: []
    },
    onPullDownRefresh() {
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
    getUser(page = 1) {
        post('v1_user/info', {
            page,
            id: app.globalData.user.uid
        }, `renren ${app.globalData.user.Authorization}`).then(res => {
            if (res.code == 200) {
                var oldData = this.data.companyList;
                var newData = res.data.list;
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
        });
    },
    onLoad() {
        this.getUser();
    }
});