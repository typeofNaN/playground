<template>
  <div>
    <nuxt/>
    <tab-bar/>
    <zw/>
  </div>
</template>

<script>
import TabBar from '~/components/shared/TabBar.vue'
import zw from '~/components/shared/zw.vue'
export default {
  components: {
    TabBar,
    zw
  }
}
</script>
