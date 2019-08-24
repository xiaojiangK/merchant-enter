import { post } from '../../utils/utils.js'

Page({
  data: {
    error: ''
  },
  onLoad() {
    wx.getStorage({
      key: 'userId',
      success() {
        wx.redirectTo({
            url: '/pages/selection/index'
        });
      }
    });
  },
  formFocus() {
    this.setData({
      error: ''
    });
  },
  formSubmit(e) {
    var username = e.detail.value.user;
    var password = e.detail.value.pass;
    if (!username && !password) {
      this.setData({
        error: '账户或密码不能为空！'
      });
      return;
    } else {
      if (!username) {
        this.setData({
          error: '账号不能为空！'
        });
        return;
      } else if(!password) {
        this.setData({
          error: '密码不能为空！'
        });
        return;
      } else {
        this.setData({
          error: ''
        });
      }
    }
    post('v1_sign/loginin', { username, password }).then(res => {
      if (res.code == 200) {
        wx.navigateTo({
          url: '/pages/selection/index'
        });
        wx.setStorage({
          key: 'userId',
          data: res.data
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