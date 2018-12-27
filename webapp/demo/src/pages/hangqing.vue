<template>
  <section id="hangqing">
    <tb/>
    <zw40/>
    <hqlist/>
    <tab-bar/>
    <zw40/>
  </section>
</template>

<script>
import tb from '~/components/hq/tb.vue'
import zw40 from '~/components/shared/zw40.vue'
import hqlist from '~/components/hq/hqlist.vue'
import TabBar from '~/components/shared/TabBar.vue'
import zw40 from '~/components/shared/zw40.vue'
export default {
  components: {
    tb,
    zw40,
    hqlist,
    TabBar,
    zw40
  }
}
</script>
