import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/pages/index'
import Steps from '@/pages/steps'
// import signin from '@/pages/auth/signin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/steps',
      name: 'steps',
      component: Steps
    }
  ]
})
