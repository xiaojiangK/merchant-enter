import { post } from '../../utils/utils.js';

Page({
    data: {
        id: "",
        url: '',
        list: []
    },
    onLoad(opt) {
        this.setData({
            id: opt.id
        });
        post('v1_entry/List', { id: this.data.id }).then(res => {
            if (res.code == 200) {
                var list = res.data.map(item => {
                    var type = -1;
                    var status = -1;
                    var statusText = '';
                    if (item.pay_ment == 1) {
                        type = 'official';
                    } else {
                        type = 'network';
                    }
                    if (item.status	== 0 || item.status	== 2 || item.status	== 3) {
                        status = 1;
                        statusText = '审核中';
                    } else if (item.status == 4 || item.status == 5) {
                        status = 2;
                        statusText = '审核失败';
                    } else {
                        statusText = '审核成功';
                    }
                    return {
                        ...item,
                        statusText,
                        url: `/pages/applyResult/index?status=${status}&type=${type}&id=${this.data.id}&applyId=${item.id}`
                    };
                });
                this.setData({ list });
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                });
            }
        });
    },
    toSelect() {
        var applyId = 0;
        for (let i of this.data.list) {
            if (i.status == 4 || i.status == 5) {
                applyId = i.id;
            }
        }
        wx.navigateTo({
            url: `/pages/selectApply/index?id=${this.data.id}&applyId=${applyId}`
        });
    }
});