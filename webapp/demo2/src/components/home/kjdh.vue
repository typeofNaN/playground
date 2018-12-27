<template>
  <section
    v-if="show == 1"
    id="kjdh"
  >
    <img
      src="http://circleforex.oss-cn-shanghai.aliyuncs.com/extension/doubledenier/images/doubleClose.png"
      @click="close"
    >
  </section>
</template>

<script>
export default {
  data () {
    return {
      show: 1
    }
  },
  methods: {
    close () {
      console.log(this)
      console.log(this.showad)
      this.showad++
      console.log(this.showad)
      this.show++
      console.log(this.show)
    }
  }
}
</script>

<style scoped>
#kjdh {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}
img {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -25px;
  margin-left: -25px;
  width: 50px;
  height: 50px;
}
</style>
