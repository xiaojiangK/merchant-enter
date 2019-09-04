
import { post } from '../../utils/utils.js';
var app = getApp();

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
        post('v1_entry/List', { id: this.data.id }, `renren ${app.globalData.user.Authorization}`).then(res => {
            if (res.code == 100002) {
                wx.showToast({
                    title: '授权已过期，请重新授权',
                    icon: 'none'
                });
                wx.removeStorage({
                    key: 'user'
                });
                app.globalData.user = {};
                wx.navigateTo({
                    url: '/pages/login/index'
                });
                return;
            }
            if (res.code == 200) {
                // res.data = [{
                //     account_type: "02",
                //     channels: '{"ali":"2"}',
                //     create_time: "1567498461",
                //     customer_id: "85",
                //     email: "21312@qq.com",
                //     id: "120",
                //     mch_id: "85",
                //     mch_name: "12313213",
                //     pay_ment: "1",
                //     phone: "13265541514",
                //     status: "0",
                //     trade_type: ["01", '06'],
                //     use_name: "123"
                // }]
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
                        channels: JSON.parse(item.channels),
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
        wx.navigateTo({
            url: `/pages/selectApply/index?id=${this.data.id}`
        });
    }
});