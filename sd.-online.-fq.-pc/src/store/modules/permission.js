import { constantRoutes } from '@/router/index'
import Layout from '@/layout/index.vue'
const obj = {
  '/home': 'home/index.vue',
  '/caseList': 'caseList/index.vue',
  '/query': 'query/index.vue',
  '/videoList': 'videoList/index.vue',
  '/manage/router': 'manage/router.vue',
  '/manage/role': 'manage/role.vue',
  '/manage/account': 'manage/account.vue',
}
// 1.先识别所有的views/文件夹name/*.vue文件
// 这里限制性很高，只有路径为/views/文件夹name/*.vue，的文件才能背识别，如果不在这个结构，自己增加吧，然后再合并
const modules = import.meta.glob('../../views/*/*.vue')
/**
 * Use meta.role to determine if the current user has permissiond
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

function filterAsyncRouter(asyncRouterMap) {
  //遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter((route) => {
    //if (route.children != undefined) {
    if (route.children != undefined) {
      //Layout组件特殊处理
      route.component = Layout
    } else {
      if (obj[route.path] != undefined) {
        //webpack方式
        /*         route.component = 
          import(
            `../../views/${obj[route.path].split('/')[0]}/${
              obj[route.path].split('/')[1]
            }`
          
        ) */
        //vite方式
        route.component = modules[`../../views/${obj[route.path]}`]
      } else {
        route.component = modules[`../../views/error/404.vue`]
      }
    }
    //}
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
  return accessedRouters
}

const state = {
  routes: [],
  addRoutes: [],
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  RESET_ROUTES: (state, routes) => {
    state.addRoutes = []
    state.routes = []
  },
}

const actions = {
  generateRoutes({ commit }, data) {
    return new Promise((resolve) => {
      let accessedRoutes
      //if (roles.includes('admin')) {
      //  accessedRoutes = data.route || []
      //} else {
      accessedRoutes = filterAsyncRouter(data.routers)
      accessedRoutes.push({
        path: '/',
        name: 'redirect',
        redirect: accessedRoutes[0].path,
      })
      //}
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  resetRoutes({ commit }, data) {
    return new Promise((resolve) => {
      commit('RESET_ROUTES', [])
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
