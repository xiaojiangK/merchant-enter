import { get } from '../../utils/utils.js'

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
        if (opts.applyId) {
          this.setData({
            applyId: opts.applyId
          });
          get(`1/entry/info?id=${opts.applyId}`).then(res => {
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
      wx.showModal({
        title: '通知',
        content: '是否要返回首页？（你所填写的资料将会被保存）',
        cancelText: '取消',
        confirmText: '确定',
        success: (result) => {
          if(result.confirm){
            var type = this.data.type;
            if (type == 'official' || type == 'network') {
              wx.redirectTo({
                url: `/pages/selectApply/index?id=${this.data.id}&applyId=${this.data.applyId}`
              });
            } else {
              wx.navigateBack({
                delta: 1
              });
            }
          }
        }
      });
    },
});