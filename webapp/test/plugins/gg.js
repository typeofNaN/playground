import Vue from 'vue'

const showad = {
  install(Vue) {
    Vue.prototype.showad = {
      created: (window.onresize = () => {
        var show = 1
        return show
      })()
    }
  }
}

Vue.use(showad)
