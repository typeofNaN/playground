<template>
  <section id="Home">
    <swiper/>
    <nav-bar/>
    <cjqx/>
    <jyzx/>
    <kjdh/>
  </section>
</template>

<script>
import Swiper from '~/components/home/Swiper.vue'
import NavBar from '~/components/home/NavBar.vue'
import cjqx from '~/components/home/cjqx.vue'
import jyzx from '~/components/home/jyzx.vue'
import kjdh from '~/components/home/kjdh.vue'
export default {
  components: {
    Swiper,
    NavBar,
    cjqx,
    jyzx,
    kjdh
  }
}
</script>
