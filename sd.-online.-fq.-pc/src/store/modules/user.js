import { login, getRoute } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: window.localStorage.getItem('name'),
  canVideo: false,
  route: [],
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_CANVIDEO: (state, canVideo) => {
    state.canVideo = canVideo
  },
  SET_ROUTE: (state, route) => {
    state.route = route
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ account_Name: username.trim(), account_Password: password })
        .then((response) => {
          const { data } = response
          // 保存token到store
          commit('SET_TOKEN', data.auth_Token)
          // 保存token到本地
          setToken(data.auth_Token)
          commit('SET_NAME', username)
          window.localStorage.setItem('name', username)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // get route
  getRoutes({ commit, state }) {
    return new Promise((resolve, reject) => {
      getRoute()
        .then((response) => {
          const { data } = response
          //判断用户能否进行视频
          data.forEach((element) => {
            if (element.route_Url == '/videoList') {
              commit('SET_CANVIDEO', true)
            }
          })
          commit('SET_ROUTE', data)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // 退出登录，删除信息
      commit('SET_TOKEN', '')
      commit('SET_CANVIDEO', false)
      removeToken()
      resetRouter()
      dispatch('permission/resetRoutes', [], { root: true })
      window.localStorage.setItem('name', '')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_CANVIDEO', false)
      removeToken()
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
