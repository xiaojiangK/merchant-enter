import { post } from '../../utils/utils.js';
var app = getApp();

Page({
  data: {
    error: ''
  },
  onLoad() {
    if (app.globalData.user.Authorization) {
      wx.redirectTo({
        url: '/pages/selection/index'
      });
    }
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
    wx.showToast({
      title: '登录中...',
      icon: 'none'
    });
    post('v1_sign/loginin', { username, password }).then(res => {
      if (res.code == 200) {
        wx.setStorage({
          key: 'user',
          data: res.data,
          success: () => {
            wx.navigateTo({
              url: '/pages/selection/index'
            });
          }
        });
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
      wx.hideLoading();
    });
  }
});