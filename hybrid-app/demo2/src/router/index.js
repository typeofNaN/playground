import Vue from 'vue'
import Router from 'vue-router'
import home from '@/pages/index'
import hangqing from '@/pages/hangqing'
import hqdetail from '@/pages/Hqdetail'
import jiaoyi from '@/pages/jiaoyi'
import jiepan from '@/pages/jiepan'
import me from '@/pages/me'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/hangqing',
      name: 'hangqing',
      component: hangqing
    },
    {
      path: '/hqdetail',
      name: 'hqdetail',
      component: hqdetail
    },
    {
      path: '/jiaoyi',
      name: 'jiaayi',
      component: jiaoyi
    },
    {
      path: '/jiepan',
      name: 'jiepan',
      component: jiepan
    },
    {
      path: '/me',
      name: 'me',
      component: me
    }
  ]
})
