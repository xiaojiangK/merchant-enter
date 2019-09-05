import { get } from '../../utils/utils.js';
var app = getApp();

Page({
    data: {
      id: '',
      type: '',
      status: 1,
      reason: '',
      channels: {},
      navTitle: '等待审核'
    },
    onLoad(opts) {
        /**
         * 1 => 审核中
         * 2 => 审核驳回
         */
        if (opts.status == 2) {
          this.setData({
            navTitle: '审核驳回'
          });
        }
        if (opts.applyId) {
          this.setData({
            applyId: opts.applyId
          });
        }
        if (opts.status == 2) {
          this.setData({
            "channels.wx": opts.wx == 1 || opts.wx == 3 ? 1 : 0,
            "channels.zfb": opts.zfb == 2 || opts.zfb == 4 ? 1 : 0
          });
          get(`1/entry/info?id=${opts.applyId}`, `renren ${app.globalData.user.Authorization}`).then(res => {
            if (res.code == 200) {
              this.setData({
                reason: res.data.reason
              });
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              });
            }
          });
        }
        this.setData({
          id: opts.id,
          type: opts.type,
          status: opts.status
        });
    },
    goUpdate() {
      var channels = this.data.channels;
      if (this.data.type == 'official') {
        wx.navigateTo({
          url: `/pages/officialInfo/index?id=${this.data.id}&wx=${channels.wx}&zfb=${channels.zfb}&applyId=${this.data.applyId}&save=1`
        });
      } else {
        wx.navigateTo({
          url: `/pages/networkInfo/index?id=${this.data.id}&wx=${channels.wx}&zfb=${channels.zfb}&applyId=${this.data.applyId}&save=1`
        });
      }
    },
    // 监听返回
    goBack() {
      var applyId = this.data.applyId;
      if (applyId) {
        wx.redirectTo({
          url: `/pages/apply/index?id=${this.data.id}&applyId=${applyId}&isBack=1`
        });
      } else {
        wx.redirectTo({
          url: `/pages/apply/index?id=${this.data.id}&isBack=1`
        });
      }
    },
});