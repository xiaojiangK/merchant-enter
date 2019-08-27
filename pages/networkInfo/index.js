import { get, post, checkEmail } from '../../utils/utils.js'
var config = require('../../config/index');
var app = getApp();

Page({
  data: {
    id: '',
    step: 1,
    basicInfo: {      // 保存信息
      MerchantType: "01",
      MerchantName: '',
      Alias: '',
      DealType: '',
      mchRegion: ["110000", "110100", "110101"],
      bankRegion: ["110000", "110100", "110101"],
      Address: '',
      jingying: '',
      ServicePhoneNo: '',
      Email: '',
      LicensePhoto: '',
      OtherBankCardNo: '',
      Mcc: '2015050700000000',
      PayChannelList: ["01", "02"],
      TradeTypeList: ["01", "02", "06", "08"],
      ShopPhoto: '',
      ShopEntrancePhoto: '',
      BranchName: '工商银行',
      AccountType: '01',
      BankCardNo: '',
      ContactLine: '',
      IndustryLicensePhoto: '',
      PrincipalMobile: '',
      CertPhotoA: '',
      CertPhotoB: ''
    },
    MerchantType: [{       // 商户类型
      title: '自然人',
      value: '01',
      checked: true
    },{
      title: '个体户商户',
      value: '02',
      checked: false
    },{
      title: '企业商户',
      value: '03',
      checked: false
    }],
    mccIdx: 0,
    mccData: ['美食','超市便利店','休闲娱乐','购物','爱车','生活服务','教育培训','医疗健康','航旅','专业销售/批发','政府/社会组织'],
    mccID: ['2015050700000000','2015091000052157','2015062600004525','2015062600002758','2016062900190124','2015063000020189','2016042200000148','2016062900190296','2015080600000001','2016062900190337','2016062900190371'],
    dealIdx: 0,
    dealData: ['实体特约商户', '网络特约商户', '实体兼网络特约商户'],
    mchRegion: ['北京市', '北京市', '东城区'],
    bankRegion: ['北京市', '北京市', '东城区'],
    PayChannel: [{       // 支付渠道
      title: '微信',
      value: '01',
      checked: true
    },{
      title: '支付宝',
      value: '02',
      checked: true
    }],
    TradeTypeList: [{       // 交易类型
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
    },{
      title: '动态订单扫码(尚未开发)',
      value: '08',
      checked: true
    }],
    branchIdx: 0,
    branchData: [
      "中国工商银行","中国农业银行","中国银行"
      ,"中国建设银行","国家开发银行","中国进出口银行"
      ,"中国农业发展银行","交通银行","中信银行"
      ,"中国光大银行","华夏银行","中国民生银行"
      ,"广发银行","平安银行","招商银行"
      ,"兴业银行","上海浦东发展银行","城市商业银行"
      ,"农村商业银行","恒丰银行","浙商银行"
      ,"农村合作银行","渤海银行","徽商银行"
      ,"地方银行","重庆三峡银行","上海农商银行"
      ,"城市信用社","农村信用合作联社","中国邮政储蓄银行"
      ,"汇丰银行","东亚银行","南洋商业银行"
      ,"恒生银行","中国银行（香港）","集友银行"
      ,"创兴银行","大众银行","永亨银行"
      ,"上海商业银行","永隆银行","大新银行"
      ,"中信银行国际（中国）有限公司","华南商业银行","彰化商业银行"
      ,"国泰世华商业银行","合作金库商业银行","第一商业银行"
      ,"台湾土地银行","花旗银行","美国银行"
      ,"摩根大通银行","美国建东银行","三菱东京日联银行"
      ,"三井住友银行","瑞穗银行","日本山口银行"
      ,"日本三井住友信托银行","外换银行","友利银行"
      ,"韩国产业银行","新韩银行","企业银行"
      ,"韩亚银行","国民银行","马来西亚马来亚银行"
      ,"首都银行","华侨银行","大华银行"
      ,"星展银行","盘谷银行","泰国开泰银行"
      ,"奥地利奥合国际银行","比利时联合银行","苏格兰皇家银行"
      ,"荷兰安智银行","渣打银行","英国巴克莱银行"
      ,"瑞典商业银行","瑞典北欧斯安银行","瑞典银行"
      ,"法国兴业银行","东方汇理银行","法国外贸银行"
      ,"德国德累斯登银行","德意志银行","德国商业银行"
      ,"德国宝缔纲银行","德国北德意志州银行","中德住房储蓄银行"
      ,"意大利裕信银行","意大利联合圣保罗银行","瑞士信贷银行"
      ,"瑞士银行","加拿大丰业银行","蒙特利尔银行"
      ,"澳大利亚和新西兰银行","摩根士丹利国际银行","华美银行"
      ,"荷兰合作银行","厦门国际银行","法国巴黎银行"
      ,"华商银行","华一银行"
    ],
    AccountType: [{
      title: '对公账户',
      value: '01',
      checked: true
    },{
      title: '私人账户',
      value: '02',
      checked: false
    }],
    bankData: [],   // 支行名称
    bankID: [],     // 支行ID
    bankIdx: 0,
    helpIdx: -1,
    help: [
      '营业执照是工商行政管理机关发给工商企业、个体经营者的准许从事某项生产经营活动的凭证。其格式由国家工商行政管理局统一规定。'
    ],
    popupTitle: '',
    navTitle: '网商通道',
    baseURL: config.baseImgURL
  },
  onLoad(opt) {
    this.setData({
      id: opt.id,
      applyId: opt.applyId
    });
    // 需要用保存的资料
    if (opt.save == 1) {
      get(`1/entry/info?id=${this.data.applyId}`, `renren ${app.globalData.user.Authorization}`).then(res => {
        if (res.code == 200) {
          var res = res.data;
          var data = this.data;
          // 商户类型
          var MerchantType = data.MerchantType.map(i => {
            if (i.value == res.mch_type) {
              i.checked = true;
            } else {
              i.checked = false;
            }
            return i;
          });
          // 商户地址
          var mchID = [];
          var mchRegion = [];
          res.address_pcr.map(i => {
            mchID.push(i.id);
            mchRegion.push(i.name);
          });
          // 经营类目
          var mccIdx = 0;
          data.mccID.map((i, j) => {
            if (i == res.mch_cate) {
              mccIdx = j;
            }
          });
          // 支付渠道
          var channel = res.payment_channel.split(',');
          var PayChannel = data.PayChannel.map(i => {
            if (channel.includes(i.value)) {
              i.checked = true;
            } else {
              i.checked = false;
            }
            return i;
          });
          // 交易类型
          var trade = res.trade_type.split(',');
          var TradeTypeList = data.TradeTypeList.map(i => {
            if (trade.includes(i.value)) {
              i.checked = true;
            } else {
              i.checked = false;
            }
            return i;
          });
          // 开户行
          var branchIdx = 0;
          data.branchData.map((i, j) => {
            if (i == res.account_name) {
              branchIdx = j;
            }
          });
          // 账户类型
          var AccountType = data.AccountType.map(i => {
            if (i.value == res.account_type) {
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
          this.setData({
            basicInfo: {
              Mcc: res.mch_cate,
              ShopPhoto: res.store_photo,
              DealType: res.business_type,
              MerchantType: res.mch_type,
              MerchantName: res.company_name,
              Alias: res.mch_name,
              mchRegion: mchID,
              bankRegion: bankID,
              Address: res.address,
              jingying: res.business_scope,
              ServicePhoneNo: res.tel,
              Email: res.email,
              TradeTypeList: trade,
              PayChannelList: channel,
              LicensePhoto: res.bus_photo,
              BranchName: res.account_name,
              ContactLine: res.back_branch,
              AccountType: res.account_type,
              BankCardNo: res.account_number,
              CertPhotoA: res.blame_card_pos,
              CertPhotoB: res.blame_card_opp,
              OtherBankCardNo: res.card_number,
              PrincipalMobile: res.blame_phone,
              IndustryLicensePhoto: res.in_store_photo,
              ShopEntrancePhoto: res.shop_entrance_photo
            },
            mccIdx,
            branchIdx,
            mchRegion,
            bankRegion,
            PayChannel,
            AccountType,
            MerchantType,
            TradeTypeList,
            dealIdx: Number.parseInt(res.business_type) - 1
          });
        }
      });
    }
  },
  // 步骤一-下一步
  nextStep(e) {
    var info = this.data.basicInfo;
    var data = e.detail.value;
    var value = {
      ...data,
      DealType: `0${data.DealType + 1}`
    };
    // 自然人
    if (value.MerchantType == '01') {
      if (!value.MerchantName) {
        wx.showToast({
          title: '公司名称不能为空',
          icon: 'none'
        });
        return;
      } else if (!value.Address) {
        wx.showToast({
          title: '详细地址不能为空',
          icon: 'none'
        });
        return;
      } else if (!value.jingying) {
        wx.showToast({
          title: '经营范围不能为空',
          icon: 'none'
        });
        return;
      }
    } else {  // 个体、企业
      if (!info.LicensePhoto) {
        wx.showToast({
          title: '营业执照未上传',
          icon: 'none'
        });
        return;
      }
    }
    if (!value.MerchantType.length) {
      wx.showToast({
        title: '商户类型至少选择一项',
        icon: 'none'
      });
      return;
    } else if (!value.Alias) {
      wx.showToast({
        title: '商户简称不能为空',
        icon: 'none'
      });
      return;
    } else if (!value.ServicePhoneNo) {
      wx.showToast({
        title: '客服电话不能为空',
        icon: 'none'
      });
      return;
    } else if (!value.Email) {
      wx.showToast({
        title: '商户邮箱不能为空',
        icon: 'none'
      });
      return;
    } else if (!checkEmail(value.Email)) {
      wx.showToast({
        title: '商户邮箱格式不正确',
        icon: 'none'
      });
      return;
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
  nextStep2(e) {
    var info = this.data.basicInfo;
    var value = e.detail.value;
    // 自然人
    if (info.MerchantType != '03') {
      if (!value.OtherBankCardNo) {
        wx.showToast({
          title: '结算方式不能为空',
          icon: 'none'
        });
        return;
      }
    }
    if (!value.PayChannelList.length) {
      wx.showToast({
        title: '支付渠道至少选择一项',
        icon: 'none'
      });
      return;
    } else if (!value.TradeTypeList.length) {
      wx.showToast({
        title: '交易类型至少选择一项',
        icon: 'none'
      });
      return;
    } else if (!info.ShopPhoto) {
      wx.showToast({
        title: '店铺招牌照片未上传',
        icon: 'none'
      });
      return;
    } else if (!info.ShopEntrancePhoto) {
      wx.showToast({
        title: '门店内景照片未上传',
        icon: 'none'
      });
      return;
    }
    this.setData({
      step: 3,
      basicInfo: {
        ...info,
        ...value
      }
    });
  },
  // 步骤三-下一步
  nextStep3(e) {
    var info = this.data.basicInfo;
    var value = e.detail.value;
    if (!value.AccountType.length) {
      wx.showToast({
        title: '账户类型至少选择一项',
        icon: 'none'
      });
      return;
    }
    if (info.MerchantType == '03') {
      if (!info.IndustryLicensePhoto) {
        wx.showToast({
          title: '开户许可证未上传',
          icon: 'none'
        });
        return;
      }
    } else {
      if (!value.BankCardNo) {
        wx.showToast({
          title: '银行卡号不能为空',
          icon: 'none'
        });
        return;
      } else if (!info.ContactLine) {
        wx.showToast({
          title: '所在支行未选择',
          icon: 'none'
        });
        return;
      }
    }
    this.setData({
      step: 4,
      basicInfo: {
        ...info,
        ...value
      }
    });
  },
  // 步骤四-下一步
  nextStep4(e) {
    var info = this.data.basicInfo;
    var value = e.detail.value;
    if (!value.PrincipalMobile) {
      wx.showToast({
        title: '负责人手机号不能为空',
        icon: 'none'
      });
      return;
    } else if (!info.CertPhotoA) {
      wx.showToast({
        title: '负责人身份证正面未上传',
        icon: 'none'
      });
      return;
    } else if (!info.CertPhotoB) {
      wx.showToast({
        title: '负责人身份证反面未上传',
        icon: 'none'
      });
      return;
    }

    var data = {
      ...info,
      ...value,
      mch_id: app.globalData.user.uid,
      customer_id: this.data.id,
      entryid: this.data.applyId
    };

    // api
    post('v1_entry/ws_entry', data, `renren ${app.globalData.user.Authorization}`).then(res => {
      if (res.code == 200) {
        wx.navigateTo({
          url: `/pages/applyResult/index?status=1&type=network&id=${this.data.id}`
        });
      } else {
        this.setData({
          popupTitle: '提交失败，请重新尝试',
        });
        setTimeout(() => {
          this.setData({
            popupTitle: ''
          });
        }, 1500);
      }
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
  // 单选checkbox
  singleChange(e) {
    var type = e.currentTarget.dataset.type;
    var val = e.currentTarget.dataset.val;
    var info = `basicInfo.${type}`;
    var data = this.data[type].map(item => {
      if (item.value == val) {
        item.checked = true;
      } else {
        item.checked = false;
      }
      return item;
    });
    if (type == 'AccountType') {
      this.setData({
        AccountType: data
      });
    } else {
      this.setData({
        MerchantType: data
      });
    }
    this.setData({
      [info]: val
    });
  },
  dealChange(e) {
    this.setData({
      dealIdx: Number.parseInt(e.detail.value)
    });
  },
  regionChange(e) {
    var type = e.currentTarget.dataset.type;
    var info = `basicInfo.${type}`;
    var code = e.detail.code;
    var value = e.detail.value;
    if (type == 'mchRegion') {
      this.setData({
        mchRegion: value
      });
    } else {
      this.setData({
        bankRegion: value
      });
    }
    this.setData({
      [info]: code
    });
  },
  mccChange(e) {
    var idx = e.detail.value;
    this.setData({
      mccIdx: idx,
      "basicInfo.Mcc": this.data.mccID[idx]
    });
  },
  branchChange(e) {
    var idx = e.detail.value;
    this.setData({
      branchIdx: idx,
      "basicInfo.BranchName": this.data.branchData[idx]
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
    var key = e.detail.value;
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
          wx.hideLoading();
        } else {
          wx.showToast({
            title: '未搜索出此支行',
            icon: 'none'
          });
        }
      }
    });
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
        url: `http://i.qiuxin.tech/Currency/Uploadpic?mch_id=${app.globalData.user.uid}`,
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
            if (type == 0) {
              this.setData({ "basicInfo.LicensePhoto": path });
            } else if (type == 1) {
              this.setData({ "basicInfo.ShopPhoto": path });
            } else if (type == 2) {
              this.setData({ "basicInfo.ShopEntrancePhoto": path });
            } else if (type == 3) {
              this.setData({ "basicInfo.IndustryLicensePhoto": path });
            } else if (type == 4) {
              this.setData({ "basicInfo.CertPhotoA": path });
            } else if (type == 5) {
              this.setData({ "basicInfo.CertPhotoB": path });
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
    wx.showModal({
      title: '通知',
      content: '是否要返回首页？（你所填写的资料将会被保存）',
      cancelText: '取消',
      confirmText: '确定',
      success: (result) => {
        if(result.confirm){
          // 保存资料
          var data = {
            ...info,
            ...value,
            mch_id: app.globalData.user.uid,
            customer_id: this.data.id,
            entryid: this.data.applyId
          };

          // api
          post('v1_entry/ws_entry', data, `renren ${app.globalData.user.Authorization}`).then(res => {
            if (res.code == 200) {
              wx.navigateBack({
                delta: 1
              });
            } else {
              this.setData({
                popupTitle: '保存失败，请重新尝试',
              });
              setTimeout(() => {
                this.setData({
                  popupTitle: ''
                });
              }, 1500);
            }
          });
        }
      }
    });
  },
  // 帮助弹层
  helpUp(e) {
    var helpIdx = e.target.dataset.idx;
    if (helpIdx == this.data.helpIdx) {
      this.setData({ helpIdx: -1 });
    } else {
      this.setData({ helpIdx });
    }
  }
});