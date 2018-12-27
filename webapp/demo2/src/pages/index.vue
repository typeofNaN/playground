<template>
  <section id="Home">
    <swiper/>
    <nav-bar/>
    <cjqx/>
    <jyzx/>
    <kjdh/>
    <tab-bar/>
    <zw40/>
  </section>
</template>

<script>
import Swiper from '@/components/home/Swiper.vue'
import NavBar from '@/components/home/NavBar.vue'
import cjqx from '@/components/home/cjqx.vue'
import jyzx from '@/components/home/jyzx.vue'
import kjdh from '@/components/home/kjdh.vue'
import TabBar from '@/components/shared/TabBar.vue'
import zw40 from '@/components/shared/zw40.vue'
export default {
  components: {
    Swiper,
    NavBar,
    cjqx,
    jyzx,
    kjdh,
    TabBar,
    zw40
  }
}
</script>
