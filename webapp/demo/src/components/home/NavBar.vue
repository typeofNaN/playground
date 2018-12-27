<template>
  <section
    id="NavBar"
    class="mgb10"
  >
    <ul class="clearfix">
      <li
        v-for="(navbar, index) in navbars"
        :key="index"
        class="fl pdtb10 bg-white fs12 gray col3 text-center"
      >
        {{ navbar }}
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  computed: {
    navbars() {
      return ['金融学院', '新手学堂', '开立账户', '财经日历']
    }
  }
}
</script>
