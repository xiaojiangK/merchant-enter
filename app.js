App({
  globalData: {
    user: {}
  },
  onLaunch () {
    wx.getStorage({
      key: 'user',
      success: (res)=>{
        this.globalData.user = res.data
      }
    });
  }
})