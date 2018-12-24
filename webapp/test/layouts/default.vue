<template>
  <div>
    <nuxt/>
    <tab-bar/>
    <zw40/>
  </div>
</template>

<script>
import TabBar from '~/components/shared/TabBar.vue'
import zw40 from '~/components/shared/zw40.vue'
export default {
  components: {
    TabBar,
    zw40
  }
}
</script>
