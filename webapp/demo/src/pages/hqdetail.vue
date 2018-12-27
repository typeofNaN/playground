<template>
  <section id="hqdetail">
    <dtb/>
    <zw40/>
    <img src="~/static/hqd.png">
    <tab-bar/>
    <zw40/>
  </section>
</template>

<script>
import dtb from '~/components/hq/dtb.vue'
import zw40 from '~/components/shared/zw40.vue'
import TabBar from '~/components/shared/TabBar.vue'
export default {
  components: {
    dtb,
    zw40,
    TabBar,
  }
}
</script>

<style scoped>
img {
  width: 100%;
}
</style>
