import { get, post, checkTel, checkEmail } from '../../utils/utils.js'
var config = require('../../config/index');
var app = getApp();
var timer = null;
var count = 60;

Page({
  data: {
    id: '',
    step: 1,
    basicInfo: {      // 保存信息
      MerchantType: '',
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
      Mcc: '',
      PayChannelList: ["01", "02"],
      TradeTypeList: ["01", "02", "06", "08"],
      ShopPhoto: '',
      ShopEntrancePhoto: '',
      BranchName: '',
      AccountType: '',
      BankCardNo: '',
      ContactLine: '',
      IndustryLicensePhoto: '',
      PrincipalMobile: '',
      CertPhotoA: '',
      CertPhotoB: '',
      SupportPrepayment: 'N',
      SettleMode: '01',
      PartnerType: '03',
      BankCertName: '',
      CertType: '01',
      LegalPerson: '',
      PrincipalPerson: '',
      PrincipalCertNo: '',
      ContactName: '',
      ContactMobile: '',
      lanhai: '',
      FeeType: '02',
      ali_t1_fee: '0.006',
      wx_t1_fee: '0.006',
      BussAuthNum: ''
    },
    mccIdx: -1,
    mccData: ['美食','超市便利店','休闲娱乐','购物','爱车','生活服务','教育培训','医疗健康','航旅','专业销售/批发','政府/社会组织'],
    mccID: ['2015050700000000','2015091000052157','2015062600004525','2015062600002758','2016062900190124','2015063000020189','2016042200000148','2016062900190296','2015080600000001','2016062900190337','2016062900190371'],
    dealIdx: -1,
    dealData: ['实体特约商户', '网络特约商户', '实体兼网络特约商户'],
    mchRegion: ['北京市', '北京市', '东城区'],
    bankRegion: ['北京市', '北京市', '东城区'],
    PayChannel: [{       // 支付渠道
      title: '支付宝',
      value: '01',
      checked: true,
      disabled: false
    },{
      title: '微信',
      value: '02',
      checked: false,
      disabled: true
    }],
    TradeTypeList: [{       // 交易类型
      title: '正扫交易',
      value: '01',
      checked: true,
      disabled: true
    },{
      title: '反扫交易',
      value: '02',
      checked: true,
      disabled: true
    },{
      title: '退款交易',
      value: '06',
      checked: true,
      disabled: true
    },{
      title: '动态订单扫码(尚未开发)',
      value: '08',
      checked: true,
      disabled: true
    }],
    branchIdx: -1,
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
    accountType: ['私人账户', '对公账户'],
    accountIdx: -1,
    merchantIdx: -1,
    MerchantType: ['自然人', '个体工商户', '企业商户'], // 商户类型
    supportData: ['不支持'],    // 是否支持T+0
    supportIdx: 0,
    bankData: [],   // 支行名称
    bankID: [],     // 支行ID,
    settleMode: ['结算到他行卡'],
    settleIdx: 0,
    partnerType: ['合作机构公众号'],
    partnerIdx: 0,
    CertType: ['身份证'],
    certIdx: 0,
    lanhaiData: ['是','否'],
    lanhaiIdx: -1,
    FeeData: ['T1收单手续费'],
    FeeIdx: 0,
    bankIdx: -1,
    helpIdx: -1,
    help: [
      '营业执照是工商行政管理机关发给工商企业、个体经营者的准许从事某项生产经营活动的凭证。其格式由国家工商行政管理局统一规定。'
    ],
    popupTitle: '',
    navTitle: '网商通道',
    baseURL: config.baseImgURL,
    sendText: '获取验证码',
    disabled: false,
    bankKeyword: '',
    status: ''
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
        var pay = data.pay_ment[1];
        var PayChannel = this.data.PayChannel.map(item => {
          if (item.value == '01') {
            return {
              ...item,
              disabled: pay.zfblst == 1 ? true : false
            }
          } else {
            return {
              ...item,
              // disabled: pay.wxlst == 1 ? true : false
              disabled: true
            }
          }
        });
        this.setData({
          PayChannel
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
      status: opt.status ? opt.status : '',
      applyId: opt.applyId
    });
    // 需要用保存的资料
    if (opt.save == 1) {
      get(`1/entry/info?id=${this.data.applyId}`, `renren ${app.globalData.user.Authorization}`).then(res => {
        if (res.code == 200) {
          var res = res.data;
          var data = this.data;
          // 商户地址
          var mchID = [];
          var mchRegion = [];
          res.address_pcr.map(i => {
            mchID.push(i.id);
            mchRegion.push(i.name);
          });
          // 经营类目
          var mccIdx = -1;
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
          var branchIdx = -1;
          data.branchData.map((i, j) => {
            if (i == res.account_name) {
              branchIdx = j;
            }
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
          var info = this.data.basicInfo;
          this.setData({
            basicInfo: {
              ...this.data.basicInfo,
              Mcc: res.mch_cate,
              CertNo: res.CertNo,
              BussAuthNum: res.business,
              CardHolderAddress: res.CardHolderAddress,
              CertType: res.CertType || info.CertType,
              LegalPerson: res.legal_name || info.LegalPerson,
              PrincipalPerson: res.blame_name,
              PrincipalCertNo: res.blame_certno,
              ContactName: res.contacts_name,
              ContactMobile: res.contacts_phone,
              lanhai: res.lanhai || info.lanhai,
              FeeType: res.FeeType || info.FeeType,
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
              SettleMode: res.settlement,
              LicensePhoto: res.bus_photo,
              BranchName: res.account_name,
              ContactLine: back_branch.id,
              bankKeyword: back_branch.title,
              AccountType: res.account_type,
              BankCardNo: res.account_number,
              CertPhotoA: res.blame_card_pos,
              CertPhotoB: res.blame_card_opp,
              OtherBankCardNo: res.card_number,
              PrincipalMobile: res.blame_phone,
              SupportPrepayment: res.is_account,
              BankCertName: res.bank_account_number,
              IndustryLicensePhoto: res.in_store_photo,
              ShopEntrancePhoto: res.shop_entrance_photo
            },
            mccIdx,
            branchIdx,
            mchRegion,
            bankRegion,
            PayChannel,
            TradeTypeList,
            supportIdx: res.is_account == 'N' ? 0 : 1,
            dealIdx: Number.parseInt(res.business_type) - 1,
            merchantIdx: Number.parseInt(res.mch_type) - 1,
            settleIdx: Number.parseInt(res.settlement) - 1,
            accountIdx: Number.parseInt(res.account_type) - 1,
            lanhaiIdx: -1,
            FeeIdx: 0
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
    if (!value.MerchantName) {
      wx.showToast({
        title: '公司名称不能为空',
        icon: 'none'
      });
      return;
    } else if (!value.Alias) {
      wx.showToast({
        title: '商户简称不能为空',
        icon: 'none'
      });
      return;
    } else if (!info.MerchantType) {
      wx.showToast({
        title: '商户类型未选择',
        icon: 'none'
      });
      return;
    } else if (!info.DealType) {
      wx.showToast({
        title: '商户经营类型未选择',
        icon: 'none'
      });
      return;
    } else if (!info.SupportPrepayment) {
      wx.showToast({
        title: '是否支持T+0未选择',
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
    if (!info.SettleMode) {
      wx.showToast({
        title: '结算方式未选择',
        icon: 'none'
      });
      return;
    } else if (!value.OtherBankCardNo) {
      wx.showToast({
        title: '储蓄卡卡号不能为空',
        icon: 'none'
      });
      return;
    } else if (!info.Mcc) {
      wx.showToast({
        title: '经营类目未选择',
        icon: 'none'
      });
      return;
    } else if (!value.PayChannelList.length) {
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
    } else if (!info.PartnerType) {
      wx.showToast({
        title: '公众号类型未选择',
        icon: 'none'
      });
      return;
    } 
    if (info.MerchantType != '01') {
      if (!value.BussAuthNum) {
        wx.showToast({
          title: '营业执照注册号不能为空',
          icon: 'none'
        });
        return;
      }
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
    var value = e.detail.value;
    var info = this.data.basicInfo;
    if (info.MerchantType != '01') {
      if (!info.LicensePhoto) {
        wx.showToast({
          title: '营业执照未上传',
          icon: 'none'
        });
        return;
      }
    } else if (info.MerchantType == '03') {
      if (!info.IndustryLicensePhoto) {
        wx.showToast({
          title: '开户许可证未上传',
          icon: 'none'
        });
        return;
      }
    }
    if (!info.ShopPhoto) {
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
      step: 4
    });
  },
  // 步骤四-下一步
  nextStep4(e) {
    var info = this.data.basicInfo;
    var value = e.detail.value;
    if (!value.BankCertName) {
      wx.showToast({
        title: '银行账户户名不能为空',
        icon: 'none'
      });
      return;
    } else if (!info.BranchName) {
      wx.showToast({
        title: '开户行未选择',
        icon: 'none'
      });
      return;
    } else if (!info.AccountType) {
      wx.showToast({
        title: '账户类型未选择',
        icon: 'none'
      });
      return;
    } else if (!value.BankCardNo) {
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
    if (info.AccountType == '01') {
      if (!info.CertType) {
        wx.showToast({
          title: '持证人证件类型未选择',
          icon: 'none'
        });
        return;
      } else if (!value.CertNo) {
        wx.showToast({
          title: '持证人证件号码不能为空',
          icon: 'none'
        });
        return;
      } else if (value.CertNo.length < 18) {
        wx.showToast({
          title: '持证人证件号码不合法',
          icon: 'none'
        });
        return;
      } else if (!value.CardHolderAddress) {
        wx.showToast({
          title: '持证人地址不能为空',
          icon: 'none'
        });
        return;
      }
    }
    this.setData({
      step: 5,
      basicInfo: {
        ...info,
        ...value
      }
    });
  },
  // 步骤五-审核
  nextStep5(e) {
    // checkTel
    var info = this.data.basicInfo;
    var value = e.detail.value;
    if (info.MerchantType == '03') {
      if (!value.LegalPerson) {
        wx.showToast({
          title: '企业法人名称不能为空',
          icon: 'none'
        });
        return;
      }
    }
    if (!value.PrincipalPerson) {
      wx.showToast({
        title: '负责人/法人姓名不能为空',
        icon: 'none'
      });
      return;
    } else if (!value.PrincipalMobile) {
      wx.showToast({
        title: '负责人手机号不能为空',
        icon: 'none'
      });
      return;
    } else if (!checkTel(value.PrincipalMobile)) {
      wx.showToast({
        title: '负责人手机号不合法',
        icon: 'none'
      });
      return;
    } else if (!value.PrincipalCertNo) {
      wx.showToast({
        title: '负责人身份证号码不能为空',
        icon: 'none'
      });
      return;
    } else if (value.PrincipalCertNo.length < 18) {
      wx.showToast({
        title: '负责人身份证号码不合法',
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
    } else if (!value.ContactName) {
      wx.showToast({
        title: '联系人姓名不能为空',
        icon: 'none'
      });
      return;
    } else if (!value.ContactMobile) {
      wx.showToast({
        title: '联系人手机号不能为空',
        icon: 'none'
      });
      return;
    } else if (!checkTel(value.ContactMobile)) {
      wx.showToast({
        title: '联系人手机号不合法',
        icon: 'none'
      });
      return;
    } else if (value.ContactMobile != value.PrincipalMobile) {
      wx.showToast({
          title: '负责人手机号必须和联系人手机号一致!',
          icon: 'none'
      });
      return;
    } else if (!info.lanhai) {
      wx.showToast({
        title: '是否申请蓝海未选择',
        icon: 'none'
      });
      return;
    } else if (!info.FeeType) {
      wx.showToast({
        title: '手续费用类型未选择',
        icon: 'none'
      });
      return;
    } else if (!value.mobile_sms) {
      wx.showToast({
        title: '手机验证码不能为空',
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
    wx.showLoading({
      title: '提交中...',
      mask: true
    });
    // api
    post('v1_entry/ws_entry', data, `renren ${app.globalData.user.Authorization}`).then(res => {
      if (res.code == 200) {
        wx.navigateTo({
          url: `/pages/applyResult/index?status=1&type=network&id=${this.data.id}`
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
  countDown() {
      if (count <= 1) {
        this.setData({
          disabled: false,
          sendText: '获取验证码'
        });
        count = 60;
        clearInterval(timer);
      }
      else {
        count--;
        this.setData({
          disabled: true,
          sendText: `发送成功 ${count}s`
        });
      }
  },
  sendCode() {
    var info = this.data.basicInfo;
    if (!info.ContactMobile) {
        wx.showToast({
          title: '联系人手机号不能为空',
          icon: 'none'
        });
        return;
    } else if (!checkTel(info.ContactMobile)) {
      wx.showToast({
        title: '联系人手机号不合法',
        icon: 'none'
      });
      return;
    } else if (!checkTel(info.PrincipalMobile)) {
      wx.showToast({
        title: '负责人手机号不合法',
        icon: 'none'
      });
      return;
    }
    if (info.ContactMobile != info.PrincipalMobile) {
      wx.showToast({
        title: '负责人手机号必须和联系人手机号一致!',
        icon: 'none'
      });
      return;
    }
    wx.showLoading({
      title: '发送中...',
      mask: true
    });
    post('v1_entry/ws_sms', { mobile_type: "04", mobile: info.ContactMobile }, `renren ${app.globalData.user.Authorization}`).then(res => {
        if (res.code == 200) {
          timer = setInterval(() => {
            this.countDown();
          }, 1000);
          this.setData({
            disabled: true
          });
        }
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
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
    // if (type == 'AccountType') {
    //   this.setData({
    //     AccountType: data
    //   });
    // }
    this.setData({
      [info]: val
    });
  },
  pickerChange(e) {
    var type = e.currentTarget.dataset.type;
    var value = Number.parseInt(e.detail.value);
    var info = '';
    var infoVal = `0${value + 1}`;
    if (type == 'merchantIdx') {               // 商户类型
      info = 'basicInfo.MerchantType';
    } else if (type == 'dealIdx') {            // 经营类型
      info = 'basicInfo.DealType';
    } else if (type == 'supportIdx') {         // 支持T+0
      if (value == 0) {
        infoVal = 'N';
      }
      info = 'basicInfo.SupportPrepayment';
    } else if (type == 'settleIdx') {          // 结算方式
      info = 'basicInfo.SettleMode';
    } else if (type == 'partnerIdx') {         // 公众号类型
      if (value == 0) {
        infoVal = '03';
      }
      info = 'basicInfo.PartnerType';
    } else if (type == 'certIdx') {
      info = 'basicInfo.CertType';
    } else if(type == 'accountIdx') {
      info = 'basicInfo.AccountType';
    } else if(type == 'lanhaiIdx') {
      info = 'basicInfo.lanhai';
    } else if(type == 'FeeIdx') {
      if (value == 0) {
        infoVal = '02';
      }
      info = 'basicInfo.FeeType';
    }
    this.setData({
      [type]: value,
      [info]: infoVal
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
    var info = this.data.basicInfo;
    if (!info.MerchantName && !info.Alias && !info.MerchantType && !info.DealType && !info.Address && !info.jingying && !info.ServicePhoneNo && !info.Email) {
      wx.navigateBack({
        delta: 1
      });
      return;
    }
    var status = this.data.status;
    var content = '是否要返回首页？（你所填写的资料将会被保存）';
    if (status == 2) {
      content = '是否要返回首页？（你所填写的资料不会被保存）';
    }
    wx.showModal({
      title: '通知',
      content,
      cancelText: '取消',
      confirmText: '确定',
      success: (result) => {
        if (status != 2) {
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
          post('v1_entry/ws_entry', data, `renren ${app.globalData.user.Authorization}`).then(res => {
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
        }
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
        helpIdx: -1
      });
    }
  },
  // 帮助弹层
  helpUp(e) {
    var helpIdx = e.target.dataset.idx;
    if (helpIdx == this.data.helpIdx) {
      this.setData({
        helpIdx: -1
      });
    } else {
      this.setData({
        helpIdx
      });
    }
  }
});