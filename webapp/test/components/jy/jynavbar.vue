<template>
  <section id="jynavbar">
    <mt-navbar v-model="selected">
      <mt-tab-item
        v-for="(nav, index) in navs"
        :key="index"
        :id="index"
      >
        {{ nav }}
      </mt-tab-item>
    </mt-navbar>
    <!-- tab-container -->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item
        v-for="(a, index) in 5"
        :key="index"
        :id="index"
      >
        <mt-cell
          v-for="(n, index) in 10"
          :key="index"
          :title="'第' + a + '个模块的' + n + '条内容'"
        />
      </mt-tab-container-item>
    </mt-tab-container>
  </section>
</template>

<script>
export default {
  data() {
    return {
      selected: 0
    }
  },
  computed: {
    navs() {
      return ['持仓', '挂单', '当日成交', '当日盈亏', '更多']
    }
  }
}
</script>
