<template>
  <section id="info">
    <img src="https://oss.lwwasia.com/public/img/about/about_about_icon4.png">
    <span class="sp1">账号：123456</span>
    <span class="sp2">资产：$10000.00</span>
    <span class="sp3">客服</span>
    <button>开户</button>
  </section>
</template>

<style scoped>
#info {
  position: relative;
  width: 100%;
  height: 180px;
  color: gold;
  background-color: #555;
}
img {
  position: absolute;
  top: 40px;
  left: 10px;
  width: 40px;
  height: 40px;
}
.sp1 {
  position: absolute;
  top: 40px;
  left: 60px;
  font-size: 12px;
}
.sp2 {
  position: absolute;
  top: 60px;
  left: 60px;
  font-size: 14px;
}
.sp3 {
  position: absolute;
  top: 30px;
  right: 10px;
  font-size: 12px;
}
button {
  position: absolute;
  bottom: 30px;
  left: 5%;
  width: 90%;
  height: 30px;
  color: white;
  background-color: gold;
  border-radius: 4px;
  border: none;
}
</style>
