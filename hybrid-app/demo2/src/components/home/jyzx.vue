<template>
  <section
    id="jyzx"
    class="pdtb10 bg-white"
  >
    <div class="container">
      <h2 class="mgb10 gold fs14">交易资讯</h2>
      <ul>
        <li
          v-for="(o, index) in 10"
          :key="index"
          class="pdtb4 grey"
        >
          {{ '资讯' + o }}
        </li>
      </ul>
    </div>
  </section>
</template>
