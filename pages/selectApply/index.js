import { post } from '../../utils/utils.js';
var app = getApp();

Page({
    data: {
        id: '',
        applyId: '',
        channels: [],
        applying: 0,
        openType: 0
    },
    onLoad(opt) {
        if (opt.applyId) {
            this.setData({
                applyId: opt.applyId
            });
        }
        this.setData({
            id: opt.id
        });
    },
    onShow() {
        post('v1_entry/Entryroad', { id: this.data.id }, `renren ${app.globalData.user.Authorization}`).then(res => {
            var data = res.data;
            if (res.code == 200 && data) {
                var applying = 0;   // 是否申请
                var openType = 0;   // 开通类型
                var channels = data.pay_ment.map((item, index) => {
                    var isAll = item.wxlst == 1 && item.zfblst == 1;
                    if (isAll) {
                        applying ++;
                    }
                    if (index == 0) {
                        item.checked = true;
                    }
                    return item;
                });
                this.setData({
                    channels,
                    applying,
                    openType
                });
            }
        });
    },
    changeType(e) {
        var idx = e.currentTarget.dataset.idx;
        var item = e.currentTarget.dataset.item;
        if (item.wxlst == 0 || item.zfblst == 0) {
            var channels = this.data.channels.map((i, index)=>{
                if (index == idx) {
                    i.checked = true;
                } else {
                    i.checked = false;
                }
                return i;
            });
            this.setData({
                channels,
                openType: idx
            });
        }
    },
    goEntry(index) {
        if (index == 1) {
            wx.navigateTo({
                url: `/pages/networkInfo/index?id=${this.data.id}&applyId=`
            });
        } else {
            wx.navigateTo({
                url: `/pages/officialInfo/index?id=${this.data.id}&applyId=`
            });
        }
    },
    submit() {
        var openType = this.data.openType;
        this.data.channels.map((item, index) => {
            if (openType == index) {
                if (item.entryid) {
                    wx.showModal({
                        title: '通知',
                        content: '是否使用之前所填写资料？',
                        cancelText: '取消',
                        confirmText: '确定',
                        success: (result) => {
                            if(result.confirm){
                                if (index == 1) {
                                    wx.navigateTo({
                                        url: `/pages/networkInfo/index?id=${this.data.id}&applyId=${item.entryid}&save=1`
                                    });
                                } else {
                                    wx.navigateTo({
                                        url: `/pages/officialInfo/index?id=${this.data.id}&applyId=${item.entryid}&save=1`
                                    });
                                }
                            } else {
                                post('1/entry/info', { id: item.entryid, type: 1 }, `renren ${app.globalData.user.Authorization}`).then(res => {
                                    if (res.code != 200) {
                                        wx.showToast({
                                            title: res.msg,
                                            icon: 'none'
                                        });
                                    }
                                });
                                this.goEntry(index);
                            }
                        }
                    });
                } else {
                    this.goEntry(index);
                }
            }
        });
    }
});