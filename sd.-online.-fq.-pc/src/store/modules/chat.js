const state = {
  onlineUserList: [],
  loginResponse: [],
  onlineNotice: [],
  connectionStatus: 0,
}

const mutations = {
  SET_ONLINE_USER: (state, onlineUserList) => {
    state.onlineUserList = onlineUserList
  },
  SET_LOGIN_RESPONSE: (state, loginResponse) => {
    state.loginResponse = loginResponse
  },
  SET_ONLINE_NOTICE: (state, onlineNotice) => {
    state.onlineNotice = onlineNotice
  },
  SET_CONNECTION_STATUS: (state, connectionStatus) => {
    state.connectionStatus = connectionStatus
  },
}

const actions = {
  //登录结果
  setLoginResponse({ commit, state, dispatch }, loginResponse) {
    return new Promise((resolve) => {
      commit('SET_LOGIN_RESPONSE', loginResponse)
      resolve(loginResponse)
    })
  },
  //上线提醒 更改状态
  setOnlineNotice({ commit, state, dispatch }, onlineNotice) {
    return new Promise((resolve) => {
      var onlineUserList = state.onlineUserList
      commit('SET_ONLINE_NOTICE', onlineNotice)
      for (var i = 0; i < onlineUserList.length; i++) {
        if (
          onlineUserList[i].borrower.borrower_Id == onlineNotice.borrower_Id
        ) {
          onlineUserList[i].borrower.state = 1
        }
      }
      commit('SET_ONLINE_USER', onlineUserList)
      resolve(onlineUserList)
    })
  },
  //保存已预约列表
  setAppointmentList({ commit, state, dispatch }, appointmentList) {
    return new Promise((resolve) => {
      var onlineUserList = state.onlineUserList
      var list = appointmentList
      for (var i = 0; i < onlineUserList.length; i++) {
        for (var e = 0; e < list.length; e++) {
          if (
            onlineUserList[i].borrower.borrower_Id ==
            list[e].borrower.borrower_Id
          ) {
            list[e].borrower.state = onlineUserList[i].borrower.state
          }
        }
      }
      commit('SET_ONLINE_USER', list)
      resolve(list)
    })
  },
  //登陆后获取在线列表
  setOnlineUser({ commit, state, dispatch }, onlineUser) {
    return new Promise((resolve) => {
      if (onlineUser.length > 0) {
        if (state.onlineUserList.length == 0) {
          commit('SET_ONLINE_USER', onlineUser)
          console.log(onlineUser)
          resolve(onlineUser)
        } else {
          var onlineUserList = state.onlineUserList
          for (var i = 0; i < onlineUserList.length; i++) {
            for (var e = 0; e < onlineUser.length; e++) {
              if (
                onlineUserList[i].borrower.borrower_Id ==
                onlineUser[e].borrower_Id
              ) {
                onlineUserList[i].borrower.state = onlineUser[e].state
              }
            }
          }
          commit('SET_ONLINE_USER', onlineUserList)
          console.log(onlineUserList)
          resolve(onlineUserList)
        }
      } else {
        var onlineUserList = state.onlineUserList
        for (var i = 0; i < onlineUserList.length; i++) {
          onlineUserList[i].borrower.state = undefined
        }
        commit('SET_ONLINE_USER', onlineUserList)
        resolve(onlineUserList)
      }
    })
  },
  //更新准备状态
  setReadyResponse({ commit, state, dispatch }, ReadyResponse) {
    return new Promise((resolve) => {
      var onlineUserList = state.onlineUserList
      for (var i = 0; i < onlineUserList.length; i++) {
        if (
          onlineUserList[i].borrower.borrower_Id == ReadyResponse.borrower_Id
        ) {
          onlineUserList[i].borrower.state = 2
        }
      }
      commit('SET_ONLINE_USER', onlineUserList)
      resolve(onlineUserList)
    })
  },
  //连接状态
  setConnectionStatus({ commit, state, dispatch }, connectionStatus) {
    return new Promise((resolve) => {
      commit('SET_CONNECTION_STATUS', connectionStatus)
      resolve(connectionStatus)
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
