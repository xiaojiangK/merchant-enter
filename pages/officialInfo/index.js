import { post, get, checkTel, checkEmail } from '../../utils/utils.js'
var config = require('../../config/index');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    step: 1,
    permit: 1,
    company: 3,
    basicInfo: {
      name: '',
      phone: '',
      email: '',
      mch_name: '',
      trade_type: ["01","02","06"],
      pay: [1,2],
      mch_type: "03",
      permit_type: "01",
      card_name: '',
      account_bank: '',
      account_number:'',
      licence: '',
      bus_photo: '',
      card_pos: '',
      card_opp: '',
      store_photo: '',
      cashier_photo: '',
      in_store_photo: '',
      ServicePhoneNo: '',
      ContactLine: '',
      bankRegion: ["110000", "110100", "110101"]
    },
    bankRegion: ['北京市', '北京市', '东城区'],
    bankData: [],   // 支行名称
    bankID: [],     // 支行ID
    bankIdx: 0,
    trade_type: [{       // 交易类型
      title: '正扫交易',
      value: '01',
      checked: true
    },{
      title: '反扫交易',
      value: '02',
      checked: true
    },{
      title: '退款交易',
      value: '06',
      checked: true
    }],
    pay_ment: [{       // 支付渠道
      title: '微信',
      value: 1,
      checked: true,
      disabled: false
    },{
      title: '支付宝',
      value: 2,
      checked: true,
      disabled: false
    }],
    mch_type: [{    // 公司类型
      title: '企业',
      value: '03',
      checked: true
    },{
      title: '个体户',
      value: '02',
      checked: false
    }],
    permit_type: [{    // 开户类型
      title: '上传照片',
      value: '01',
      checked: true
    },{
      title: '手动填写',
      value: '02',
      checked: false
    }],
    popupTitle: '',
    navTitle: '官方通道',
    baseURL: config.baseImgURL,
    index: -1,
    help: [
      '正扫交易：即在支付过程中，商家对用户进行扫码; 反扫交易：即在支付过程中，用户对商家进行扫码; 退款交易：工作人员可在交易过程中，进行退款操作',
      '请选择想要开通的支付渠道',
      '营业执照有两大类：个体工商户和企业，其中企业又分：个人独资企业、合伙企业、有限责任公司、股份有限公司等类型。个体户是个人或家人经营的形式。个人独资企业、合伙企业一般规模都较小，以简单来料加工、维修服务为主，承担无限责任。公司股东以其出资额承担责任，一般不会影响生活，是比较高级的现代企业组织形式。',
      '开户许可证是由中国人民银行核发的一种开设基本账户的凭证。凡在中华人民共和国境内金融机构开立基本存款账户的单位可凭此证，办理其它金融往来业务。',
      '法定代表人是指依法代表法人行使民事权利，履行民事义务的主要负责人。',
      '开户银行是在票据清算过程中付款人或收款人开有户头的银行。',
      '银行账户是客户在银行开立的存款账户、贷款账户、往来账户的总称。',
      '营业执照是工商行政管理机关发给工商企业、个体经营者的准许从事某项生产经营活动的凭证。其格式由国家工商行政管理局统一规定。',
      '公司法人身份证就是指法人本人的居民身份证。'
    ],
    bankKeyword: ''
  },
  onLoad(opt) {
    post('v1_entry/Entryroad', { id: opt.id }, `renren ${app.globalData.user.Authorization}`).then(res => {
      var data = res.data;
      if (res.code == 100002) {
        wx.showToast({
            title: '授权已过期，请重新授权',
            icon: 'none'
        });
        wx.removeStorage({
            key: 'user'
        });
        app.globalData.user = {};
        wx.redirectTo({
            url: '/pages/login/index'
        });
        return;
      }
      if (res.code == 200) {
        var pay = data.pay_ment[0];
        var pay_ment = this.data.pay_ment.map(item => {
          if (item.value == 1) {
            return {
              ...item,
              disabled: pay.wxlst == 1 ? true : false
            }
          } else {
            return {
              ...item,
              disabled: pay.zfblst == 1 ? true : false
            }
          }
        });
        this.setData({
          pay_ment
        });
      } else {
          wx.showToast({
              title: res.msg,
              icon: 'none'
          });
      }
    });
    this.setData({
      id: opt.id,
      applyId: opt.applyId ? opt.applyId : ''
    });
    // 需要用保存的资料
    if (opt.save == 1) {
      get(`1/entry/info?id=${this.data.applyId}`, `renren ${app.globalData.user.Authorization}`).then(res => {
        if (res.code == 200) {
          var res = res.data;
          var data = this.data;
          // 交易类型
          var trade = res.trade_type;
          var trade_type = data.trade_type.map(i => {
            if (trade.includes(i.value)) {
              i.checked = true;
            } else {
              i.checked = false;
            }
            return i;
          });
          // 支付渠道
          var pay = [];
          var channels = JSON.parse(res.channels);
          var pay_ment = data.pay_ment.map((i,j) => {
            if (!channels.wx && j == 0) {
              i.checked = false;
            }
            if (!channels.ali && j == 1) {
              i.checked = false;
            }
            return i;
          });
          for (let i in channels) {
            if (i == 'wx') {
              pay.push(1);
            } else if (i == 'ali') {
              pay.push(2);
            }
          }
          // 公司类型
          var type = res.mch_type;
          var mch_type = data.mch_type.map(i => {
            if (i.value == type) {
              this.setData({
                company: type
              });
              i.checked = true;
            } else {
              i.checked = false;
            }
            return i;
          });
          // 开户许可证方式
          var permit = res.permit_type;
          var permit_type = data.permit_type.map(i => {
            if (i.value == permit) {
              this.setData({ permit });
              i.checked = true;
            } else {
              i.checked = false;
            }
            return i;
          });
          // 开户行地址
          var bankID = [];
          var bankRegion = [];
          res.back_address.map(i => {
            bankID.push(i.id);
            bankRegion.push(i.name);
          });
          // 开户支行
          var back_branch = JSON.parse(res.back_branch);
          this.setData({
            basicInfo: {
              pay,
              mch_type: type,
              name: res.use_name,
              trade_type: trade,
              phone: res.phone,
              email: res.email,
              bankRegion: bankID,
              permit_type: permit,
              mch_name: res.mch_name,
              card_name: res.card_name,
              ContactLine: back_branch.id,
              bankKeyword: back_branch.title,
              account_bank: res.account_bank,
              account_number: res.account_number,
              ServicePhoneNo: res.tel,
              licence: res.licence ? res.licence : '',               // 开户许可证
              bus_photo: res.bus_photo,
              card_pos: res.card_pos,
              card_opp: res.card_opp,
              store_photo: res.store_photo,
              cashier_photo: res.cashier_photo,   // 公司收银台
              in_store_photo: res.in_store_photo
            },
            pay_ment,
            trade_type,
            mch_type,
            permit_type,
            bankRegion
          });
          if (this.data.bankKeyword) {
            this.bankSearch();
          }
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          });
        }
      });
    }
  },
  // 步骤一-下一步
  nextStep(e) {
    var info = this.data.basicInfo;
    var value = e.detail.value;
    if (!value.name) {
      wx.showToast({
        title: '联系人姓名不能为空',
        icon: 'none'
      });
      return;
    } else if (!value.phone) {
      wx.showToast({
        title: '联系人手机不能为空',
        icon: 'none'
      });
      return;
    } else if (!checkTel(value.phone)) {
      wx.showToast({
        title: '联系人手机不正确',
        icon: 'none'
      });
      return;
    } else if (!value.email) {
      wx.showToast({
        title: '联系人邮箱不能为空',
        icon: 'none'
      });
      return;
    } else if (!checkEmail(value.email)) {
      wx.showToast({
        title: '联系人邮箱格式不正确',
        icon: 'none'
      });
      return;
    } else if (!value.mch_name) {
      wx.showToast({
        title: '商户简称不能为空',
        icon: 'none'
      });
      return;
    } else if (!value.ServicePhoneNo) {
      wx.showToast({
        title: '商户客服电话不能为空',
        icon: 'none'
      });
      return;
    } else if (!value.trade_type.length) {
      wx.showToast({
        title: '交易类型至少选择一项',
        icon: 'none'
      });
      return;
    } else if (!value.pay.length) {
      wx.showToast({
        title: '支付渠道至少选择一项',
        icon: 'none'
      });
      return;
    }
    var permit = this.data.permit;
    var company = this.data.company;
    if (permit == 1 && company == 3 && !info.licence) {
      wx.showToast({
        title: '开户许可证未上传',
        icon: 'none'
      });
      return;
    }
    if (permit == 2 || company == 2) {
      if (!value.card_name) {
        wx.showToast({
          title: '法定代表人不能为空',
          icon: 'none'
        });
        return;
      } else if (!value.account_bank) {
        wx.showToast({
          title: '开户银行不能为空',
          icon: 'none'
        });
        return;
      } else if (!info.ContactLine) {
        wx.showToast({
          title: '所在支行不能为空',
          icon: 'none'
        });
        return;
      } else if (!value.account_number) {
        wx.showToast({
          title: '银行卡号不能为空',
          icon: 'none'
        });
        return;
      }
    }
    this.setData({
      step: 2,
      basicInfo: {
        ...info,
        ...value
      }
    });
  },
  // 上一步
  prevStep() {
    var step = --this.data.step;
    this.setData({ step });
  },
  // 步骤二-下一步
  nextStep2() {
    var info = this.data.basicInfo;
    if (!info.bus_photo) {
      wx.showToast({
        title: '公司营业执照未上传',
        icon: 'none'
      });
      return;
    } else if (!info.card_pos) {
      wx.showToast({
        title: '法人身份证正面未上传',
        icon: 'none'
      });
      return;
    } else if (!info.card_opp) {
      wx.showToast({
        title: '法人身份证反面未上传',
        icon: 'none'
      });
      return;
    }
    this.setData({
      step: 3
    });
  },
  // 步骤三-提交审核
  stepSubmit() {
    var info = this.data.basicInfo;
    if (!info.store_photo) {
      wx.showToast({
        title: '公司门店照片未上传',
        icon: 'none'
      });
      return;
    } else if (!info.cashier_photo) {
      wx.showToast({
        title: '公司收银台照片未上传',
        icon: 'none'
      });
      return;
    } else if (!info.in_store_photo) {
      wx.showToast({
        title: '公司营业场所照片未上传',
        icon: 'none'
      });
      return;
    }

    var data = {
      ...this.data.basicInfo,
      mch_id: app.globalData.user.uid,
      customer_id: this.data.id,
      entryid: this.data.applyId
    }
    wx.showLoading({
      title: '提交中...',
      mask: true
    });
    // api
    post('v1_entry/default_create', data, `renren ${app.globalData.user.Authorization}`).then(res => {
      if (res.code == 200) {
        wx.navigateTo({
          url: `/pages/applyResult/index?status=1&type=official&id=${this.data.id}`
        });
      } else {
        this.setData({
          popupTitle: res.msg
        });
        setTimeout(() => {
          this.setData({
            popupTitle: ''
          });
        }, 1500);
      }
      wx.hideLoading();
    });
  },
  // checkbox change
  groupChange(e) {
    var key = e.currentTarget.dataset.id;
    var info = `basicInfo.${key}`;
    this.setData({
      [info]: e.detail.value
    });
  },
  // input blur
  inputBlur(e) {
    var key = e.currentTarget.dataset.id;
    var info = `basicInfo.${key}`;
    this.setData({
      [info]: e.detail.value
    });
  },
  // 公司类型切换
  companyChange(e) {
    var company = e.currentTarget.dataset.type;
    var mch_type = this.data.mch_type.map(item => {
      if (item.value == company) {
        item.checked = true;
      } else {
        item.checked = false;
      }
      return item;
    });
    this.setData({
      company,
      mch_type,
      "basicInfo.mch_type": company
    });
  },
  // 开户许可证切换
  permitChange(e) {
    var permit = e.currentTarget.dataset.type;
    var permit_type = this.data.permit_type.map(item => {
      if (item.value == permit) {
        item.checked = true;
      } else {
        item.checked = false;
      }
      return item;
    });
    this.setData({
      permit,
      permit_type,
      "basicInfo.permit_type": permit
    });
  },
  regionChange(e) {
    var code = e.detail.code;
    var value = e.detail.value;
    this.setData({
      bankRegion: value,
      "basicInfo.bankRegion": code
    });
  },
  // 搜索所在支行
  bankSearch(e) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    var bankID = [];
    var bankData = [];
    var key = this.data.bankKeyword || e.detail.value;
    post('Currency/Searchlist', { key }, `renren ${app.globalData.user.Authorization}`).then(res => {
      if (res.code == 200) {
        if (res.data.length) {
          res.data.map(item => {
            bankID.push(item.instOutCode);
            bankData.push(item.bankName);
          });
          this.setData({
            bankID,
            bankData,
            "basicInfo.ContactLine": bankID[0]
          });
        } else {
          wx.showToast({
            title: '未搜索出此支行',
            icon: 'none'
          });
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
    });
    wx.hideLoading();
  },
  bankChange(e) {
    var idx = e.detail.value;
    this.setData({
      bankIdx: idx,
      "basicInfo.ContactLine": this.data.bankID[idx]
    });
  },
  // 上传图片
  uploadFile(res, type) {
    wx.showLoading({
      title: '图片上传中...',
      mask: true
    });
    var src = res.tempFilePaths[0];
    let last = src.lastIndexOf(".") + 1;
    var imgType = src.substr(last);
    if (imgType == 'bmp' || imgType == 'png' || imgType == 'jpeg' || imgType == 'jpg' || imgType == 'gif') {
      wx.uploadFile({
        url: `${config.baseURL}Currency/Uploadpic?mch_id=${app.globalData.user.uid}`,
        filePath: src,
        header: {
          "Authorization": `renren ${app.globalData.user.Authorization}`,
          "Content-Type": "multipart/form-data",
          'accept': 'application/json',
        },
        name: 'file',
        success: (res) => {
          var data = JSON.parse(res.data);
          if (data.code == 200) {
            var path = data.data.path;
            if (type == 1) {
              this.setData({ "basicInfo.bus_photo": path });
            } else if (type == 2) {
              this.setData({ "basicInfo.card_pos": path });
            } else if (type == 3) {
              this.setData({ "basicInfo.card_opp": path });
            } else if (type == 4) {
              this.setData({ "basicInfo.store_photo": path });
            } else if (type == 5) {
              this.setData({ "basicInfo.cashier_photo": path });
            } else if (type == 6) {
              this.setData({ "basicInfo.in_store_photo": path });
            } else {
              this.setData({ "basicInfo.licence": path });
            }
          }
          wx.showToast({
            title: data.msg,
            icon: 'none'
          });
        },
        fail: (res) => {
          var data = JSON.parse(res.data);
          this.setData({
            popupTitle: data.msg,
          });
          setTimeout(() => {
            this.setData({
              popupTitle: ''
            });
          }, 1500);
        },
        complete: () => {
          wx.hideLoading();
        }
      });
    } else {
      this.setData({
        popupTitle: '图片不符合格式  请重新上传',
      });
      setTimeout(() => {
        this.setData({
          popupTitle: ''
        });
      }, 1500);
      wx.hideLoading();
    }
  },
  // 上传开户许可证/公司信息/门店照片
  uploadLicence(e) {
    var type = e.currentTarget.dataset.type;
    wx.showActionSheet({
      itemList: ['拍照', '从相册中选择'],
      success: (res) => {
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['camera'],
            success: (res)=> {
              this.uploadFile(res, type);
            }
          })
        } else {
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album'],
            success: (res) => {
              this.uploadFile(res, type);
            }
          })
        }
      }
    });
  },
  // 监听返回
  goBack() {
    var info = this.data.basicInfo;
    if (!info.name && !info.phone && !info.email && !info.mch_name && !info.ServicePhoneNo && info.trade_type.length == 3 && info.pay.length == 2 && info.mch_type == '03' && info.permit_type == '01' && !info.licence && !info.card_name && !info.account_bank && !info.ContactLine && !info.account_number) {
      wx.navigateBack({
        delta: 1
      });
      return;
    }
    wx.showModal({
      title: '通知',
      content: '是否要返回首页？（你所填写的资料将会被保存）',
      cancelText: '取消',
      confirmText: '确定',
      success: (result) => {
        // 保存资料
        var data = {
          ...this.data.basicInfo,
          type: 1,
          mch_id: app.globalData.user.uid,
          customer_id: this.data.id,
          entryid: this.data.applyId
        };
        wx.showLoading({
          title: '提交中...',
          mask: true
        });
        // api
        post('v1_entry/default_create', data, `renren ${app.globalData.user.Authorization}`).then(res => {
          if (res.code == 200) {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            });
          } else {
            this.setData({
              popupTitle: res.msg,
            });
            setTimeout(() => {
              this.setData({
                popupTitle: ''
              });
            }, 1500);
          }
          wx.hideLoading();
        });
        if(result.confirm){
          wx.navigateBack({
            delta: 2
          });
        }
      }
    });
  },
  bindBody(e) {
    if (!e.target.dataset.idx) {
      this.setData({
        index: -1
      });
    }
  },
  // 帮助弹层
  helpUp(e) {
    var index = e.target.dataset.idx;
    if (index == this.data.index) {
      this.setData({
        index: -1
      });
    } else {
      this.setData({
        index
      });
    }
  }
});