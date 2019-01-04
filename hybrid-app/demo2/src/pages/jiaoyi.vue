<template>
  <section id="jiaoyi">
    <jytb/>
    <zw40/>
    <jynavbar/>
    <tab-bar/>
    <zw40/>
  </section>
</template>

<script>
import jytb from '@/components/jy/jytb.vue'
import zw40 from '@/components/shared/zw40.vue'
import jynavbar from '@/components/jy/jynavbar.vue'
import TabBar from '@/components/shared/TabBar.vue'
export default {
  components: {
    jytb,
    zw40,
    jynavbar,
    TabBar
  }
}
</script>
