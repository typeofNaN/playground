import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
//vite无法使用
import 'element-plus/lib/theme-chalk/index.css'
//import '/@modules/element-plus/lib/theme-chalk/index.css'
import { post, get, put } from './utils/http'
import router from './router'
import { setupStore } from './store'
import * as animate from 'animate.css'
import './router/permission'
if (process.env.NODE_ENV == 'development') {
  //require('./mock')
}
import locale from 'element-plus/lib/locale/lang/zh-cn'
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
import { LineChart, PieChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  PieChart,
  LegendComponent,
])

const app = createApp(App)
app.config.devtools = true
app.config.globalProperties.$post = post
app.config.globalProperties.$get = get
app.config.globalProperties.$put = put
app.config.globalProperties.$echarts = echarts
app.use(echarts)

setupStore(app)
app.use(animate)
app.use(ElementPlus, { locale })
// 路由判断登录 根据路由配置文件的参数
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requireAuth)) {
    // 判断该路由是否需要登录权限
    console.log('需要登录')
    if (localStorage.getItem('token')) {
      next()
    } else {
      next({
        path: '/',
        query: { redirect: to.fullPath },
      })
    }
  } else {
    next()
  }
})

app.use(router)

import { countRunning } from '@/directive'
countRunning(app)
app.mount('#app')
