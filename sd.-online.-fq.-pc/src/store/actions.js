/**
 * 设置登录态
 * @param commit
 * @param loginStatus
 */
export function setLoginStatus({ commit }, loginStatus) {
  commit('SET_LOGIN_STATUS', loginStatus)
}

/**
 * 设置用户信息
 * @param commit
 * @param userInfo
 */
export function setUserInfo({ commit }, userInfo) {
  commit('SET_USER_INFO', userInfo)
}

/**
 * 设置trtc实例
 * @param commit
 * @param trtcCalling
 */
export function setTrtcCalling({ commit }, trtcCalling) {
  commit('SET_TRTC_CALL', trtcCalling)
}
/**
 * 设置trtc信息
 * @param commit
 * @param trtcInfo
 */
export function setTrtcInfo({ commit }, trtcInfo) {
  commit('SET_TRTC_INFO', trtcInfo)
}
/**
 * 设置sdk信息
 * @param commit
 * @param sdkInfo
 */
export function setSdkInfo({ commit }, sdkInfo) {
  commit('SET_SDK_INFO', sdkInfo)
}

/**
 * 设置当前菜单index
 * @param commit
 * @param currentPageIndex
 */
export function setCurrentPageIndex({ commit }, currentPageIndex) {
  commit('SET_CURRENT_PAGE_INDEX', currentPageIndex)
}

/**
 * 打开的案件
 * @param commit
 * @param caseList
 */
export function setOpenCaseList({ commit }, caseList) {
  commit('SET_OPEN_CASE', caseList)
}
