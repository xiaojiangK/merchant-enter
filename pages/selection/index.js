Page({
    data: {
        
    },
    onLoad() {
        wx.getStorage({
            key: 'userId',
            fail() {
                wx.redirectTo({
                    url: '/pages/login/index'
                });
            }
        });
    }
});