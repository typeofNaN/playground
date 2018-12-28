// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui'
import '@/assets/css/base.css'
import 'mint-ui/lib/style.css'
import '@/assets/css/style.css'
import '@/assets/css/mint.css'
// import showad from '@/unit/show.js'
// import showad from '@/unit/gg.js'
import showad from '@/unit/dyshow.js'
import xz from '@/unit/selected.js'

Vue.use(Mint)
Vue.config.productionTip = false
Vue.prototype.showad = showad
Vue.prototype.xz = xz

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
