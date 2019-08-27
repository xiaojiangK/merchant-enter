var app = getApp();

Page({
    data: {
        
    },
    onLoad() {
        if (!app.globalData.user.Authorization) {
            wx.redirectTo({
                url: '/pages/login/index'
            });
        }
    }
});