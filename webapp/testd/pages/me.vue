<template>
  <section id="me">
    <info/>
    <melists/>
  </section>
</template>

<script>
import info from '~/components/me/info.vue'
import melists from '~/components/me/melists.vue'
export default {
  components: {
    info,
    melists
  }
}
</script>
