<template>
  <section id="hqdetail">
    <dtb/>
    <zw40/>
    <img src="~/static/hqd.png">
  </section>
</template>

<script>
import dtb from '~/components/hq/dtb.vue'
import zw40 from '~/components/shared/zw40.vue'
export default {
  components: {
    dtb,
    zw40
  }
}
</script>

<style scoped>
img {
  width: 100%;
}
</style>
