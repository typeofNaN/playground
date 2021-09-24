import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import constant from './constant'

// 静态路由表
export const constantRoutes = constant

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
})

export const setupRouter = (app) => {
  app.use(router)
}

export const resetRouter = () => {
  const resetWhiteNameList = ['login']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name)) {
      router.removeRoute(name)
    }
  })
  router.removeRoute('redirect')

  console.log(router.getRoutes())
}

export default router
