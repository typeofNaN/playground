<template>
  <div
    id="myChart"
    :style="{ height: '100%',width:'100%'}"
  ></div>
</template>
<style lang="scss" scoped>
</style>
<script>
import { getCurrentInstance, onMounted, onBeforeUnmount, nextTick, inject, watch } from 'vue'
export default {
  setup (context) {
    var myChart1
    let { ctx, proxy } = getCurrentInstance();
    const echartInit = () => {
      myChart1 = proxy.$echarts.init(document.getElementById('myChart'));
      // 指定图表的配置项和数据
      var option = {
        xAxis: {
          type: 'category',
          data: ['1', '2', '3', '4', '5', '6', '7']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '数量',
            type: 'line',
            stack: '数量',
            lineStyle: {
              color: '#EE392F'
            },
            data: [220, 132, 601, 314, 890, 230, 510]
          }
        ],
        animationDuration: 2000,
        animationEasing: "cubicInOut",
        tooltip: {
          trigger: 'axis'
        },
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart1.setOption(option);
    }
    //接收resize通知
    var resize = inject('resizeTime')
    watch(resize, () => {
      myChart1.resize()
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