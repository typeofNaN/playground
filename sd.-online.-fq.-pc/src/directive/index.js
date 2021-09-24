export const countRunning = (app) => {
  app.directive('countRunning', {
    mounted(el, binding, vnode, prevVnode) {
      var timer = null
      const targetDomCount = el.getAttribute('data-target') //data-target为目标值
      let nowCount = parseInt(el.innerHTML) //当前页面显示值
      timer = setInterval(() => {
        if (nowCount < targetDomCount) {
          nowCount++
        } else {
          clearInterval(timer)
          timer = null
        }
        el.innerHTML = nowCount
      }, 40)
    },
  })
}
