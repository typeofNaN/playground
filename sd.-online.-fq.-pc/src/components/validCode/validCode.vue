<template>
  <div
    class="ValidCode disabled-select"
    :style="`width:${width}; height:${height}`"
    @click="refreshCode"
  >
    <span
      v-for="(item, index) in codeList"
      :key="index"
      :style="getStyle(item)"
    >{{item.code}}</span>
  </div>
</template>


<script>
import { computed, inject, ref, getCurrentInstance, onMounted, nextTick, onBeforeUnmount } from 'vue'
export default {
  name: 'validCode',
  props: {
    width: {
      type: String,
      default: '120px'
    },
    height: {
      type: String,
      default: '40px'
    },
    length: {
      type: Number,
      default: 4
    }
  },
  setup (props) {
    const { proxy } = getCurrentInstance()
    const codeList = ref([])
    onMounted(() => {
      createdCode()
    })
    function refreshCode () {
      createdCode()
    }
    function createdCode () {
      let len = props.length,
        list = [],
        chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789',
        charsLen = chars.length
      // 生成
      for (let i = 0; i < len; i++) {
        let rgb = [Math.round(Math.random() * 220), Math.round(Math.random() * 240), Math.round(Math.random() * 200)]
        list.push({
          code: chars.charAt(Math.floor(Math.random() * charsLen)),
          color: `rgb(${rgb})`,
          //fontSize: `1${[Math.floor(Math.random() * 10)]}px`,
          fontSize: `25px`,
          padding: `${[Math.floor(Math.random() * 10)]}px`,
          transform: `rotate(${Math.floor(Math.random() * 90) - Math.floor(Math.random() * 90)}deg)`
        })
      }
      // 指向
      codeList.value = list
      // 将当前数据派发出去
      proxy.$emit('update:value', list.map(item => item.code).join(''))
    }
    function getStyle (data) {
      return `color: ${data.color}; font-size: ${data.fontSize}; padding: ${data.padding}; transform: ${data.transform}`
    }
    return {
      refreshCode,
      createdCode,
      getStyle,
      codeList
    }
  }
}
</script>

<style scoped lang="scss">
.ValidCode {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  span {
    display: inline-block;
  }
}
</style>