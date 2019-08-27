const config = require('../config/index');

export function get(url, Authorization) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.baseURL + url,
            method: 'GET',
            header: {
                Authorization,
                "Content-Type": "json"
            },
            success: (res) => {
                resolve(res.data);
            },
            fail: (error) => {
                reject(error)
            }
        });
    });
}

export function post(url, data, Authorization='') {
    return new Promise(function (resolve, reject) {
        wx.request({
            url: config.baseURL + url,
            method: 'POST',
            data,
            header: {
                Authorization,
                'content-type': 'application/x-www-form-urlencoded',
            },
            success: function (res) {
                resolve(res.data);
            },
            fail: function (error) {
                reject(error)
            }
        });
    });
}

// 验证手机号
export function checkTel(phone) {
    let reg = /^1[23456789][0-9]{9}$/;
    return reg.test(phone);
}

// 验证邮箱
export function checkEmail(email) {
    var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    return reg.test(email);
}
