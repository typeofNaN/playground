import Vue from 'vue'

const showad = {
  install (Vue) {
    Vue.prototype.showad = {
      created: (window.onresize = () => {
        var show = 1
        console.log(show)
        console.log(showad)
        return show
      })()
    }
  }
}

Vue.use(showad)

export default showad
