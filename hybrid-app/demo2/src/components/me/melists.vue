<template>
  <section id="melists">
    <ul class="lists">
      <li
        v-for="(item, index) in lists"
        :key="index"
        class="list"
      >
        <router-link :to="item.to">
          <p>{{ item.title }}</p>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  computed: {
    lists () {
      return [
        {
          title: '资讯',
          to: '/me'
        },
        {
          title: '消息中心',
          to: '/me'
        },
        {
          title: '交易百宝箱',
          to: '/me'
        },
        {
          title: '设置',
          to: '/me'
        }
      ]
    }
  }
}
</script>

<style scoped>
.lists {
  padding: 10px;
}
.list {
  height: 40px;
  border-bottom: 1px solid #999;
}
.list p {
  color: #777;
  line-height: 40px;
}
</style>
