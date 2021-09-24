import router from './index'
import store from '../store'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
import { post, get, put } from '../utils/http'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login'] // 白名单

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.addRoutes.length != 0) {
        next()
        NProgress.done()
      } else {
        try {
          //if (store.getters.permission_routes.length == 0) {
          var route = await store.dispatch('user/getRoutes')
          console.log(route)
          //var res = await get('/api/PC/Route')
          //var route = res.data
          var routers = []
          for (var i = 0; i < route.length; i++) {
            routers.push({
              path: route[i].route_Url,
              name: route[i].route_Name,
              meta: {
                title: route[i].route_Name,
              },
              redirect:
                route[i].route_Url + route[i].route_Chidren[0].route_Url,
              children: [],
            })
            for (var e = 0; e < route[i].route_Chidren.length; e++) {
              routers[i].children.push({
                path: route[i].route_Chidren[e].route_Url,
                name: route[i].route_Chidren[e].route_Name,
                meta: {
                  title: route[i].route_Chidren[e].route_Name,
                },
              })
            }
          }
          // 根据用户角色，动态获取有权限的路由
          const accessRoutes = await store.dispatch(
            'permission/generateRoutes',
            {
              routers,
            }
          )
          // 动态挂载路由
          for (var i = 0; i < accessRoutes.length; i++) {
            router.addRoute(accessRoutes[i])
          }
          //}
          // if (router.getRoutes().some(item => item.path === to.path)) {
          //   console.log('已经存在该路由');
          //   next({...to})
          // } else {
          //   console.log('不存在该路由，等待');
          //   await router.isReady()
          //   console.log('路由加载完毕，跳转');
          //   next({ ...to, replace: true })
          // }
          //next(accessRoutes[0].children[0])
          next({ ...to })
        } catch (error) {
          await store.dispatch('user/resetToken')
          console.log('路由出错')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
