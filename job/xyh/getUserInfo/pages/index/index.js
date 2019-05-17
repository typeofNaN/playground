//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    btnShow: true,
    userInfo: {},
    modalHidden: true
  },
  getUserInfo: function(e) {
    this.setData({
      modalHidden: false
    })
  },
  cancel: function () {
    this.setData({
      modalHidden: true,
    }),
    setTimeout(()=> {
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'none',
        duration: 2000
      })
    }, 500)
  },
  confirm: function () {
    this.setData({
      btnShow: false,
      modalHidden: true
    }),
    setTimeout(()=> {
      this.setData({
        userInfo: app.globalData.userInfo
      }),
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 1000
      })
    }, 500)
  }
})
