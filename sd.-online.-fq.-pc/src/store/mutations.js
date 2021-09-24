const mutations = {
  SET_LOGIN_STATUS: (state, loginStatus) => {
    state.loginStatus = loginStatus
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_TRTC_CALL: (state, trtcCalling) => {
    state.trtcCalling = trtcCalling
  },
  SET_TRTC_INFO: (state, trtcInfo) => {
    state.trtcInfo = trtcInfo
  },
  SET_SDK_INFO: (state, sdkInfo) => {
    state.sdkInfo = sdkInfo
  },
  SET_CURRENT_PAGE_INDEX: (state, currentPageIndex) => {
    state.currentPageIndex = currentPageIndex
  },
  SET_OPEN_CASE: (state, caseList) => {
    state.caseList = caseList
  },
}

export default mutations
