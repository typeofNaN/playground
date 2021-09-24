// index.js
// 获取应用实例

// 使用业务流程说明：
// 首次用户通过短信打开小程序进行人脸识别，带订单号+personId，
// 人脸识别成功后，提示用户是否同意公证员预约的视频时间，可选同意/不同意，不同意系统将把结果反馈到公证员，公证员可约下一次时间，直到用户同意。
//  预约成功后，再视频前半小时可收到提醒通知，用户通过订阅消息进入小程序后进行人脸识别直接进入房间等待
const app = getApp();
var thisPage;
import {
  awx,
  onGetBirthDayASex,
  idCardValid
} from '../../utils/util'

import {
  onGetAppointment,
  onGetCertToken,
  onGetVerifyRecord
} from '../../api/api';

// const HubConnection = require('HubConnection')


Page({
  data: {
    errModal: false,
    errTxt: "获取token信息出错",
    borrower_Id: "",
    cert_Token: "",
    appointment_Id: "",
    personForm: {
      borrower_Name: "",
      id_Number: ""
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

  onLoad(options) {
    thisPage = this;
    if (options.token) {
      app.globalData.token = options.token;

      thisPage.onGetAppointmentByToken(options.token)
    }
  },

  //通过token获取预约信息
  async onGetAppointmentByToken(token) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
      duration: 15000
    })
    try {
      let {
        personForm
      } = thisPage.data;
      let resData = await onGetAppointment(token);
      // console.log(resData);
      if (resData.code == 200) {
        personForm = {
          borrower_Name: resData.data.borrower_Name,
          id_Number: resData.data.id_Number
        }
        app.globalData.start_Time = resData.data.start_Time;
        app.globalData.end_Time = resData.data.end_Time;

        thisPage.setData({
          'appointment_Id': resData.data.appointment_Id,
          'borrower_Id': resData.data.borrower_Id,
          personForm
        });
      } else {
        thisPage.setData({
          'errModal': true
        })
      }
      console.log(app.globalData)
      wx.hideLoading();
    } catch (err) {
      wx.hideLoading();
      console.log(err)
    }
  },

  onChangeModal() {
    let {
      errModal
    } = thisPage.data;
    thisPage.setData({
      'errModal': !errModal
    })
  },

  async onShow() {
    let {
      cert_Token,
      appointment_Id
    } = thisPage.data;
    if (cert_Token !== "") {
      wx.showLoading({
        title: '识别中...',
        mask: true,
        duration: 15000
      });
      let resData = await onGetVerifyRecord(cert_Token);
      console.log(resData);
      if (resData.code == 200) {
        wx.showToast({
          title: '人脸识别成功',
          duration: 2000
        });
        wx.navigateTo({
          url: `/pages/waiting/waiting?appointment_Id=${appointment_Id}`,
        })
      } else {
        thisPage.setData({
          'errModal': true,
          'errTxt': `人脸识别失败，结果：${resData.message}`
        })
      }
    }
  },

  //验证输入框表单
  async onValiForm() {
    let {
      personForm
    } = thisPage.data;

    let [ret, errMsg] = [true, ""];

    for (let i in personForm) {
      console.log(i);
      if (personForm[i] == "") {
        switch (i) {
          case "name":
            ret = false;
            errMsg = "请填写姓名";
            break;
          case "id_Number":
            ret = false;
            errMsg = "请填写身份证号";
            break;
          default:
            break;
        }
      }

      if (i == "id_Number") {
        ret = await idCardValid(personForm[i]);
        errMsg = ret ? "" : "身份证格式错误";
      }
    }
    return {
      ret,
      errMsg
    }
  }

})