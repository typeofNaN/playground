<template>
  <section id="jiepan">
    <jptb/>
    <tab-bar/>
    <zw40/>
  </section>
</template>

<script>
import jptb from '@/components/jp/jptb.vue'
import TabBar from '@/components/shared/TabBar.vue'
import zw40 from '@/components/shared/zw40.vue'
export default {
  components: {
    jptb,
    TabBar,
    zw40
  }
}
</script>
