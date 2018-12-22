<template>
  <section id="Home">
    <swiper/>
    <nav-bar/>
    <cjqx/>
    <jyzx/>
  </section>
</template>

<script>
import Swiper from '~/components/home/Swiper.vue'
import NavBar from '~/components/home/NavBar.vue'
import cjqx from '~/components/home/cjqx.vue'
import jyzx from '~/components/home/jyzx.vue'
export default {
  components: {
    Swiper,
    NavBar,
    cjqx,
    jyzx
  }
}
</script>
