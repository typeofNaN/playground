// app.js
App({
  onLaunch() {

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    start_Time: "",
    end_Time: "",
    token: "", //刚进入小程序时的token，用于换取预约信息
  },

  //全局访问路径
  getServerUrl() {
    return "http://192.168.100.118:9088" //开发
  }
})