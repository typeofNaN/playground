<template>
  <section
    id="cjqx"
    class="mgb10 pdtb10 bg-white"
  >
    <div class="container">
      <h2 class="mgb10 gold fs14">财经气象标</h2>
      <ul class="cjqxul">
        <li
          v-for="(item, index) in lists"
          :key="index"
          class="cjqxli mgb10 pd10 h50"
        >
          <span>{{ item.title1 }}</span>
          <span class="red">{{ item.title2 }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    lists () {
      return [
        {
          title1: '伦敦金1255.85',
          title2: '看空'
        },
        {
          title1: '伦敦银14.630',
          title2: '极端看空'
        }
      ]
    }
  }
}
</script>

<style scoped>
.cjqxli {
  position: relative;
  border: 1px solid #efefef;
  border-radius: 2px;
  box-shadow: 0 0 1px 1px #efefef;
  line-height: 28px;
}
.cjqxli span:last-child {
  position: absolute;
  left: 50%;
  top: 10px;
}
</style>
