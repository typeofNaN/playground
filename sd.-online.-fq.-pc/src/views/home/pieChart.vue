<template>
  <div
    id="pieChart"
    :style="{ height: '100%',width:'100%'}"
  ></div>
</template>
<style lang="scss" scoped>
</style>
<script>
import { getCurrentInstance, onMounted, onBeforeUnmount, nextTick, inject, watch } from 'vue'
export default {
  setup (context) {
    var myChart
    let { ctx, proxy } = getCurrentInstance();
    const echartInit = () => {
      myChart = proxy.$echarts.init(document.getElementById('pieChart'));
      // 指定图表的配置项和数据
      var option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        color: ['#EE392F', '#FED063'],
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: ['65%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 20, name: '审批' },
              { value: 80, name: '审核' },
            ]
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
    //接收resize通知
    var resize = inject('resizeTime')
    watch(resize, () => {
      myChart.resize()
    })
    onMounted(() => {
      echartInit()
    })
    onBeforeUnmount(() => {
    })
    return {
      echartInit
    }
  }
}
</script>