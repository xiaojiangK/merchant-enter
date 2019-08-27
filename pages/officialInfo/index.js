import { post, get, checkTel, checkEmail } from '../../utils/utils.js'
var config = require('../../config/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    step: 1,
    permit: 1,
    company: 1,
    basicInfo: {
      name: '',
      phone: '',
      email: '',
      mch_name: '',
      trade_type: ["01","02","03"],
      pay: ["01","02"],
      mch_type: "01",
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
    },
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
      value: '03',
      checked: true
    }],
    pay_ment: [{       // 支付渠道
      title: '微信',
      value: '01',
      checked: true
    },{
      title: '支付宝',
      value: '02',
      checked: true
    }],
    mch_type: [{    // 公司类型
      title: '企业',
      value: '01',
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
    ]
  },
  onLoad(opt) {
    this.setData({
      id: opt.id,
      applyId: opt.applyId
    });
    // 需要用保存的资料
    if (opt.save == 1) {
      get(`1/entry/info?id=${this.data.applyId}`).then(res => {
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
              pay.push('01');
            } else if (i == 'ali') {
              pay.push('02');
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
          this.setData({
            basicInfo: {
              pay,
              mch_type: type,
              name: res.use_name,
              trade_type: trade,
              phone: res.phone,
              email: res.email,
              permit_type: permit,
              mch_name: res.mch_name,
              card_name: res.card_name,
              account_bank: res.account_bank,
              account_number: res.account_number,
              licence: res.licence,               // 开户许可证
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
            permit_type
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
    if (permit == 1 && company == 1 && !info.licence) {
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

    wx.getStorage({
      key: 'userId',
      success: (res)=>{
        var data = {
          ...this.data.basicInfo,
          mch_id: res.data,
          customer_id: this.data.id,
          entryid: this.data.applyId
        }

        // api
        post('v1_entry/default_create', data).then(res => {
          if (res.code == 200) {
            wx.navigateTo({
              url: `/pages/applyResult/index?status=1&type=official&id=${this.data.id}`
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
      wx.getStorage({
        key: 'userId',
        success: (res)=>{
          wx.uploadFile({
            url: `http://i.qiuxin.tech/Currency/Uploadpic?mch_id=${res.data}`,
            filePath: src,
            header: {
              "Content-Type": "multipart/form-data",
              'accept': 'application/json',
            },
            name: 'file',
            success: (res) => {
              var data = JSON.parse(res.data);
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
    wx.showModal({
      title: '通知',
      content: '是否要返回首页？（你所填写的资料将会被保存）',
      cancelText: '取消',
      confirmText: '确定',
      success: (result) => {
        if(result.confirm){
          // 保存资料
          wx.getStorage({
            key: 'userId',
            success: (res)=>{
              var data = {
                ...this.data.basicInfo,
                mch_id: res.data,
                customer_id: this.data.id,
                entryid: this.data.applyId
              };

              // api
              post('v1_entry/default_create', data).then(res => {
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
          });
        }
      }
    });
  },
  // 帮助弹层
  helpUp(e) {
    var index = e.target.dataset.idx;
    if (index == this.data.index) {
      this.setData({ index: -1 });
    } else {
      this.setData({ index });
    }
  }
});