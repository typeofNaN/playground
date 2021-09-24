const app = getApp();
import {
  awx
} from '../utils/util';

//获取人脸识别token

export const onGetCertToken = async (borrower_Id) => {
  try {
    let params = {
      borrower_Id
    }
    let resData = await awx.request({
      url: `${app.getServerUrl()}/api/WeChat/Cert/CertToken`,
      method: 'get',
      data: params
    });
    return resData.data;
  } catch (err) {
    console.log(err);
  }
}

//获取人脸识别结果
export const onGetVerifyRecord = async (cert_Token) => {
  try {
    let params = {
      cert_Token
    }
    let resData = await awx.request({
      url: `${app.getServerUrl()}/api/WeChat/Cert/Record`,
      method: 'get',
      data: params
    });
    return resData.data;
  } catch (err) {
    console.log(err);
  }
}

//获取预约信息
export const onGetAppointment = async (token) => {
  try {
    let params = {
      token
    }
    let resData = await awx.request({
      url: `${app.getServerUrl()}/api/WeChat/Appointment`,
      method: 'get',
      data: params
    });
    return resData.data;
  } catch (err) {
    console.log(err)
  }
}

//提交是否同意约定时间
// 参数： 
// token：短信/订阅消息携带的token,string， 
// appointment_Id：token换取的预约ID，number， 
// is_Agree：是否同意，boolean， 
// js_Code:string
export const onSubmitAppoitment = async (params) => {
  try {
    let resData = await awx.request({
      url: `${app.getServerUrl()}/api/WeChat/Appointment/Submit`,
      method: 'post',
      data: params
    });
    return resData.data;
  } catch (err) {
    console.log(err)
  }
}

//通过token获取实时视频的live信息
export const onGetLive = async (token) => {
  try {
    let params = {
      token
    }
    let resData = await awx.request({
      url: `${app.getServerUrl()}/api/Live`,
      data: params
    });
    return resData.data;
  } catch (err) {
    console.log(err)
  }
}