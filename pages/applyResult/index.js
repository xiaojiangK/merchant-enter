import { get } from '../../utils/utils.js';
var app = getApp();

Page({
    data: {
      id: '',
      type: '',
      status: 1,
      reason: '',
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
        if (opts.applyId && opts.status == 2) {
          this.setData({
            applyId: opts.applyId
          });
          get(`1/entry/info?id=${opts.applyId}`, `renren ${app.globalData.user.Authorization}`).then(res => {
            if (res.code == 200) {
              this.setData({
                reason: res.data.reason
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
      if (this.data.type == 'official') {
        wx.navigateTo({
          url: `/pages/officialInfo/index?id=${this.data.id}&applyId=${this.data.applyId}&save=1`
        });
      } else {
        wx.navigateTo({
          url: `/pages/networkInfo/index?id=${this.data.id}&applyId=${this.data.applyId}&save=1`
        });
      }
    },
    // 监听返回
    goBack() {
      if (this.data.applyId) {
        wx.navigateBack({
          delta: 1
        });
      } else {
        wx.navigateBack({
          delta: 2
        });
      }
    },
});