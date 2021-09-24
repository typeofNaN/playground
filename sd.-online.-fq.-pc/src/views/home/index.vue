<template>
  <div class="container">
    <div class="mid-div">
      <el-row :gutter="20">
        <el-col :span="8">
          <Item
            status="全部"
            :num="100"
          />
        </el-col>
        <el-col :span="8">
          <Item
            status="审批"
            :num="20"
          />
        </el-col>
        <el-col :span="8">
          <Item
            status="审核"
            :num="40"
          />
        </el-col>
      </el-row>
    </div>
    <div class="bottom-div">
      <el-row
        :gutter="20"
        style="height:100%"
      >
        <el-col
          :span="16"
          style="height:100%"
        >
          <div class="left">
            <div class="title">
              <div class="mark"></div>
              <div class="title-text">每天完成审核趋势图</div>
            </div>
            <div class="chart">
              <Chart />
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="right">
            <div class="title">
              <div class="mark"></div>
              <div class="title-text">每天完成审核分析</div>
            </div>
            <div class="chart">
              <PieChart />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  background-color: #f9f9f9;
  height: 100%;
  .mid-div {
    height: 160px;
    padding: 10px 20px 0 20px;
  }
  .bottom-div {
    padding: 20px 20px 10px 20px;
    height: calc(100% - 200px);
    .left {
      background: #ffffff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      border-radius: 10px;
      height: calc(100% - 10px);
      .title {
        display: flex;
        flex-direction: row;
        height: 20px;
        .mark {
          width: 4px;
          height: 20px;
          background: #ee392f;
          margin: 28px 0 0 36px;
        }
        .title-text {
          vertical-align: center;
          margin: 28px 0 0 6px;
          font-size: 20px;
          font-weight: 400;
          color: #3a3a3a;
        }
      }
      .chart {
        margin-top: 60px;
        height: calc(100% - 80px);
      }
    }

    .right {
      background: #ffffff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      border-radius: 10px;
      height: calc(100% - 10px);
      .title {
        display: flex;
        flex-direction: row;
        height: 20px;
        .mark {
          width: 4px;
          height: 20px;
          background: #ee392f;
          margin: 28px 0 0 36px;
        }
        .title-text {
          vertical-align: center;
          margin: 28px 0 0 6px;
          font-size: 20px;
          font-weight: 400;
          color: #3a3a3a;
        }
      }
      .chart {
        margin-top: 60px;
        height: calc(100% - 80px);
      }
    }
  }
}
</style>
<script>
import Item from './item.vue'
import Chart from './chart.vue'
import PieChart from './pieChart.vue'

import { useStore } from 'vuex'

import { ref, onMounted, provide } from 'vue'
export default {
  components: {
    Item,
    Chart,
    PieChart
  },
  setup () {
    const store = useStore()
    const userName = ref(store.getters.name)
    const resizeTime = ref(new Date())

    //发送resize通知
    provide('resizeTime', resizeTime)
    onMounted(() => {
      window.onresize = async () => {
        resizeTime.value = new Date()
      }
    })

    return {
      userName
    }
  }
}
</script>