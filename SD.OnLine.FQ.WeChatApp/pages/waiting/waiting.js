// pages/waiting/waiting.js

import {
  HubConnection
} from "../../utils/signalr-js";

import {
  onSubmitAppoitment,
  onGetCertToken,
  onGetVerifyRecord,
  onGetLive
}
from '../../api/api';

import {
  awx
} from '../../utils/util';

const app = getApp();

var thisPage;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clickable: true,
    is_Agree: true,
    errModal: false,
    errTxt: "",
    start_Time: "",
    end_Time: "",
    appointment_Id: "",

    hubConnect: "", //websocketConnetion

    hasAppointment: false,
    personForm: {
      borrower_Name: "",
      id_Number: ""
    },
    borrower_Id: "",
    isAuthed: false,
    cert_Token: "",
    template: '1v1',
    debugMode: false,
    cloudenv: 'PRO',
    roomID: 'Os_0237566394',
    userID: 'dsr',

    waitingModal: false,
    isLoad: false,
    hasConnected: false //记录是否已经视频，视频过再次回到此页面不发送websocket登录信息
  },

  onChangeInput({
    detail
  }) {
    console.log(detail);
    let {
      is_Agree
    } = thisPage.data


    is_Agree = +detail.value ? true : false;

    thisPage.setData({
      'is_Agree': is_Agree
    })

  },

  //提交预约同意
  async onSubmit() {
    try {
      if (!thisPage.data.clickable) {
        return;
      }
      wx.showLoading({
        title: '提交中...',
        mask: true,
        duration: 15000
      })

      await thisPage.onSubscribe();
      let {
        code
      } = await awx.login();
      console.log(code);
      let {
        is_Agree,
        appointment_Id
      } = thisPage.data;
      let params = {
        appointment_Id,
        is_Agree,
        js_Code: code,
        token: app.globalData.token,
      }
      let resData = await onSubmitAppoitment(params);
      if (resData.code == 200) {
        // wx.showToast({
        //   title: '提交成功',
        //   icon: 'none',
        //   mask: true,
        //   duration: 3000
        // });
        thisPage.setData({
          'clickable': false,
          'errModal': true,
          'errTxt': '提交成功，请等待下一次通知。'
        })
        // thisPage.onSubscribe();
      } else {
        wx.showToast({
          title: '提交失败，请重新提交或退出重试',
          icon: 'none',
          mask: true,
          duration: 2000
        });
      }
      wx.hideLoading();

    } catch (err) {
      wx.hideLoading();
      console.log(err);
    }
  },

  onSubscribe() {
    let {
      errModal,
      errTxt
    } = thisPage.data;
    let tmplIds = ['3_CgkNzB4GknoKMcV57a3XanLKT6ZVjLBvDPr1LdJn8']
    wx.requestSubscribeMessage({
      tmplIds,
      success(res) {
        console.log(res);
        let index = tmplIds.findIndex(x => res[x] == "reject");
        errModal = index > -1 ? true : false;
        errTxt = index > -1 ? "不完全订阅小程序推送消息将错过后续的预约视频及排队信息，若想重新订阅可在小程序设置中打开" : "";
        thisPage.setData({
          'errModal': errModal,
          'errTxt': errTxt
        });
        // thisPage.onSubmit();
      }
    })
  },
  onChangeModal({
    currentTarget
  }) {
    let {
      key
    } = currentTarget.dataset;

    let
      vis = thisPage.data[key];
    thisPage.setData({
      [key]: !vis
    })
  },
  //进入房间
  onEnterRoom(roomID) {
    let {
      template,
      debugMode,
      cloudenv,
      waitingModal,
      userID
    } = thisPage.data;
    let url = `/pages/room/room?roomID=${roomID}&userID=${userID}&template=${template}&debugMode=${debugMode}&cloudenv=${cloudenv}`;
    thisPage.checkDeviceAuthorize().then((result) => {
      console.log('授权成功', result)
      wx.navigateTo({
        url: url
      });
      wx.hideLoading();
      thisPage.setData({
        'waitingModal': !waitingModal,
        'hasConnected': true
      })
    }).catch((error) => {
      wx.hideLoading();
      console.log('没有授权', error)
    });
  },

  checkDeviceAuthorize: function () {
    this.hasOpenDeviceAuthorizeModal = false
    return new Promise((resolve, reject) => {
      if (!wx.getSetting || !wx.getSetting()) {
        // 微信测试版 获取授权API异常，目前只能即使没授权也可以通过
        resolve()
      }
      wx.getSetting().then((result) => {
        console.log('getSetting', result)
        this.authorizeMic = result.authSetting['scope.record']
        this.authorizeCamera = result.authSetting['scope.camera']
        if (result.authSetting['scope.camera'] && result.authSetting['scope.record']) {
          // 授权成功
          resolve()
        } else {
          // 没有授权，弹出授权窗口
          // 注意： wx.authorize 只有首次调用会弹框，之后调用只返回结果，如果没有授权需要自行弹框提示处理
          console.log('getSetting 没有授权，弹出授权窗口', result)
          wx.authorize({
            scope: 'scope.record',
          }).then((res) => {
            console.log('authorize mic', res)
            this.authorizeMic = true
            if (this.authorizeCamera) {
              resolve()
            }
          }).catch((error) => {
            console.log('authorize mic error', error)
            this.authorizeMic = false
          })
          wx.authorize({
            scope: 'scope.camera',
          }).then((res) => {
            console.log('authorize camera', res)
            this.authorizeCamera = true
            if (this.authorizeMic) {
              resolve()
            } else {
              this.openConfirm()
              reject(new Error('authorize fail'))
            }
          }).catch((error) => {
            console.log('authorize camera error', error)
            this.authorizeCamera = false
            this.openConfirm()
            reject(new Error('authorize fail'))
          })
        }
      })
    })
  },

  //websocket链接
  async onConnect() {
    let {
      borrower_Id
    } = thisPage.data;
    let hubConnect = new HubConnection();
    hubConnect.start(`${app.getServerUrl()}/ChatHub`);
    hubConnect.onOpen = (res) => {
      console.log("WebSocket开始连接");
    }

    hubConnect.onClose = (res) => {
      //websocket 断开连接
      console.log(res, this);
      hubConnect.start(`${app.getServerUrl()}/ChatHub`);
    };

    hubConnect.on('LoginResponse', (res) => {
      console.log(res);
    });
    hubConnect.on('ReadyResponse', (res) => {
      console.log(res);
    });
    hubConnect.on('VideoInvite', (res) => {
      thisPage.onEnterRoom(res.room_Id);
      console.log(res);
    });


    // let that = this;
    setTimeout(() => {
      //   console.log("定时器");
      try {
        hubConnect.send('WeChatLogin', 2);

      } catch (err) {
        console.log(err);
      }
    }, 1000);

    thisPage.setData({
      'hubConnect': hubConnect
    })
  },

  //已经准备好视频
  onReadyRoom() {
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    });
    try {
      let {
        hubConnect
      } = thisPage.data;
      hubConnect.send('Ready');
    } catch (err) {
      console.log(err);
      wx.hideLoading();
    }

    // thisPage.onEnterRoom();
  },


  //通过token获取实时视频信息
  async onGetLiveByToken(token) {
    try {
      wx.showLoading({
        title: '加载中...',
        mask: true,
        duration: 15000
      })
      let {
        personForm
      } = thisPage.data;
      let resData = await onGetLive(token);
      console.log(resData);
      if (resData.code == 200) {
        personForm = {
          borrower_Name: resData.data.borrower_Name,
          id_Number: resData.data.id_Number
        }
        thisPage.setData({
          'start_Time': resData.data.start_Time,
          'end_Time': resData.data.end_Time,
          'borrower_Id': resData.data.borrower_Id,
          personForm
        });
      } else {
        thisPage.setData({
          'errModal': true,
          'errTxt': `${resData.message}`
        })
      }
      wx.hideLoading();

    } catch (err) {
      wx.hideLoading();
      console.log(err);
    }
  },

  //人脸识别按钮事件
  async onFaceAuth() {
    wx.showLoading({
      title: '处理中...',
      mask: true,
      duration: 15000
    });
    try {
      let {
        borrower_Id
      } = thisPage.data;
      let resData = await onGetCertToken(borrower_Id);
      if (resData.code == 200) {
        thisPage.setData({
          'cert_Token': resData.data.cert_Token
        });
        wx.navigateToMiniProgram({
          appId: 'wx318893774c9bfdd2',
          path: 'pages/thirdCheck/thirdCheck',
          extraData: {
            certToken: resData.data.cert_Token
          },
          success(res) {
            console.log("微警小程序打开成功");
          },
          fail(res) {
            console.log("微警小程序打开失败");
          }
        })
      } else {
        thisPage.setData({
          'errModal': true,
          'errTxt': '获取人脸识别token出错'
        })
      }
      wx.hideLoading();

    } catch (err) {
      wx.hideLoading();
      console.log(err);
    }


    // idCardValid
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thisPage = this;


    //第一次通过短信进入小程序后，此页面用于用户是否同意公证员的预约时间
    if (options.appointment_Id) {
      thisPage.setData({
        'appointment_Id': options.appointment_Id
      })
    }

    if (app.globalData.start_Time !== "" && app.globalData.end_Time !== "") {
      thisPage.setData({
        'start_Time': app.globalData.start_Time,
        'end_Time': app.globalData.end_Time
      })
    }

    //第二次用户通过订阅消息进入此页面，通过token获取预约信息，先做人脸识别，后通过websocket连接
    if (options.token) {
      thisPage.setData({
        'hasAppointment': true
      })
      // thisPage.onGetAppointmentByToken(options.token);
      thisPage.onGetLiveByToken(options.token);

      // thisPage.onConnect();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    let {
      cert_Token,
      hasConnected
    } = thisPage.data;
    if (cert_Token !== "" && !hasConnected) {
      wx.showLoading({
        title: '处理中...',
      })
      let resData = await onGetVerifyRecord(cert_Token);
      console.log(resData);
      if (resData.code == 200) {
        wx.showToast({
          title: '人脸识别成功',
          duration: 2000
        });
        wx.setKeepScreenOn({
          keepScreenOn: true,
        });
        thisPage.onConnect();
        thisPage.setData({
          'isAuthed': true,
          'waitingModal': true
        })
      } else {
        thisPage.setData({
          'errModal': true,
          'errTxt': `人脸识别失败，结果：${resData.message}`
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})