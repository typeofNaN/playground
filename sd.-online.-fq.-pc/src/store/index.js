import { createStore } from 'vuex'
import state from './state'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import permission from './modules/permission'
import user from './modules/user'
import chat from './modules/chat'

// 调试工具，开发环境使用，线上关闭
//const debug = NODE_ENV !== 'production'

const store = createStore({
  modules: {
    app,
    permission,
    user,
    chat,
  },
  state,
  mutations,
  getters,
  actions,
  //plugins: debug ? [createLogger()] : []
})

/**
 * vuex 配置
 * @param app
 */
export function setupStore(app) {
  app.use(store)
}

export default store
