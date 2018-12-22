<template>
  <section id="Swiper">
    <mt-swipe class="bg-skyblue col12 h180">
      <mt-swipe-item
        v-for="(banner, index) in banners"
        :key="index"
      >
        <img
          :src="banner"
          alt=""
          class="all100"
        >
      </mt-swipe-item>
    </mt-swipe>
  </section>
</template>

<script>
export default {
  computed: {
    banners() {
      return [
        'https://oss.lwwasia.com/public/img/index/index_banner_bg_1.png',
        'https://oss.lwwasia.com/public/img/index/index_banner_bg_2.png',
        'https://oss.lwwasia.com/public/img/index/index_banner_bg_3.png'
      ]
    }
  }
}
</script>
