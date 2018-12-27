<template>
  <section id="me">
    <info/>
    <melists/>
    <tab-bar/>
    <zw40/>
  </section>
</template>

<script>
import info from '@/components/me/info.vue'
import melists from '@/components/me/melists.vue'
import TabBar from '@/components/shared/TabBar.vue'
import zw40 from '@/components/shared/zw40.vue'
export default {
  components: {
    info,
    melists,
    TabBar,
    zw40
  }
}
</script>
