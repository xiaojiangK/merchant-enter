import { post } from '../../utils/utils.js'

Page({
    data: {
        userInfo: {},
        companyList: []
    },
    logout() {
        wx.showModal({
            content: '是否要退出登录？',
            cancelText: '取消',
            confirmText: '确定',
            success: (result) => {
                if(result.confirm){
                    post('v1_sign/quit').then(res => {
                        if (res.code == 200) {
                            wx.showToast({
                                title: res.msg,
                                icon: 'none'
                            });
                            wx.clearStorage('userId');
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
    onLoad(opts) {
        wx.getStorage({
            key: 'userId',
            success:(res) => {
                post('v1_user/info', {
                    page: 1,
                    id: res.data
                }).then(res => {
                    if (res.code == 200) {
                        this.setData({
                            userInfo: res.userinfo && res.userinfo[0],
                            companyList: res.data.list
                        });
                    } else {
                        wx.showToast({
                            title: res.msg,
                            icon: 'none'
                        });
                    }
                });
            }
          });
    }
});