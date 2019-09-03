import { post } from '../../utils/utils.js';
var app = getApp();

Page({
  data: {
    error: '',
    openid: '',
    isAuthorize: false
  },
  onShow() {
    if (app.globalData.user.Authorization) {
      wx.redirectTo({
        url: '/pages/selection/index'
      });
    }
  },
  // 用户登录
  bindGetUserInfo: function (e) {
    if (e.detail.errMsg == 'getUserInfo:ok') {
      wx.login({
        success: (res) => {
          if (res.code) {
            post('v1_sign/loginin', { code: res.code }, `renren ${app.globalData.user.Authorization}`).then(res => {
              if (res.code == 200) {
                var data = res.data;
                if (data.openid) {
                  this.setData({
                    openid: data.openid
                  });
                  wx.showToast({
                    title: '绑定成功，请登录',
                    icon: 'none'
                  });
                } else if (data.uid) {
                  wx.setStorage({
                    data,
                    key: 'user',
                    success: () => {
                      wx.navigateTo({
                        url: '/pages/selection/index'
                      });
                    }
                  });
                }
                this.setData({
                  isAuthorize: true
                });
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none'
                });
              }
            });
          }
        },
        fail: () => {
          wx.showToast({
            title: '授权失败，请重试',
            icon: 'none'
          });
        }
      });
    }
  },
  formFocus() {
    this.setData({
      error: ''
    });
  },
  formSubmit(e) {
    var openid = this.data.openid;
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
    post('v1_sign/loginin', { username, password, openid }).then(res => {
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