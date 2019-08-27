var app = getApp();

Page({
    data: {
        
    },
    onLoad() {
        wx.getStorage({
            key: 'user',
            fail: ()=>{
                wx.redirectTo({
                    url: '/pages/login/index'
                });
            }
        });
    }
});