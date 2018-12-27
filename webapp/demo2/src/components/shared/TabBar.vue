<template>
  <section id="TabBar">
    <mt-tabbar
      v-model="selected"
      fixed
    >
      <mt-tab-item
        v-for="(tabbar, index) in tabbars"
        :key="index"
        :id="index"
      >
        <router-link
          :to="tabbar.to"
          class="all100 dib gray fs12 lh28"
        >
          {{ tabbar.title }}
        </router-link>
      </mt-tab-item>
    </mt-tabbar>
  </section>
</template>

<script>
export default {
  data () {
    return {
      selected: 0
    }
  },
  computed: {
    tabbars () {
      return [
        {
          title: '首页',
          to: '/'
        },
        {
          title: '行情',
          to: '/hangqing'
        },
        {
          title: '交易',
          to: '/jiaoyi'
        },
        {
          title: '解盘',
          to: '/jiepan'
        },
        {
          title: '我',
          to: '/me'
        }
      ]
    }
  }
}
</script>
