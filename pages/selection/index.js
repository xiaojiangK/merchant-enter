var app = getApp();

Page({
    data: {
        user: {}
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
        var user = this.data.user;
        if (user.is_proxy == 1) {
            wx.navigateTo({
                url: '/pages/company/index'
            });
        } else if (user.is_proxy == 0) {
            var entry = user.is_entry;
            if (entry.gd != -1 || entry.ws != -1) {
                wx.navigateTo({
                    url: `/pages/apply/index?id=${user.uid}`
                });
            } else {
                wx.navigateTo({
                    url: `/pages/selectApply/index?id=${user.uid}`
                });
            }
        }
    }
});