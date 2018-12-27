<template>
  <section id="hangqing">
    <tb/>
    <zw40/>
    <hqlist/>
  </section>
</template>

<script>
import tb from '~/components/hq/tb.vue'
import zw40 from '~/components/shared/zw40.vue'
import hqlist from '~/components/hq/hqlist.vue'
export default {
  components: {
    tb,
    zw40,
    hqlist
  }
}
</script>
