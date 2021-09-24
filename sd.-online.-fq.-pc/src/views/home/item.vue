<template>
  <div class="col">
    <div class="left">
      <div class="status">{{status}}</div>
      <div style="margin-top:10px;display:flex;flex-direction:row;">
        <div
          class="num"
          v-countRunning
          :data-target='num'
        >0</div>
        <div style="position:relative;">
          <div style="font-size: 12px;position:absolute;bottom:12px;left:10px;color:#A3A3A3;">个</div>
        </div>
      </div>
    </div>
    <div class="right">
      <el-image
        style="width: 60px;height: 60px;"
        :src="icon0"
        :fit="fit"
        v-if="status == '全部'"
      ></el-image>
      <el-image
        style="width: 60px;height: 60px;"
        :src="icon1"
        :fit="fit"
        v-if="status == '审批'"
      ></el-image>
      <el-image
        style="width: 60px;height: 60px;"
        :src="icon2"
        :fit="fit"
        v-if="status == '审核'"
      ></el-image>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.col {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 160px;
  background: #ffffff;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  justify-content: space-between;
  align-items: flex-start;
  .left {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 37px;
    .status {
      font-size: 16px;
      font-weight: 400;
      color: #6d6d6d;
    }
    .num {
      font-size: 40px;
      font-weight: 400;
      line-height: 52px;
      color: #1e1e1e;
    }
  }
  .right {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    margin-right: 40px;
  }
}
</style>
<script>
import { ref, onMounted } from 'vue'
import icon0 from '@/assets/icon/0.png'
import icon1 from '@/assets/icon/1.png'
import icon2 from '@/assets/icon/2.png'

export default {
  props: ["status", "num"],
  setup () {

    return {
      icon0,
      icon1,
      icon2
    }
  }
}
</script>