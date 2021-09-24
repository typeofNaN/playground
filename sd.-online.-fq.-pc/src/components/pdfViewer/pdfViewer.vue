<template>
  <el-dialog
    :title="previewFile.fileName"
    width="800px"
    @close="close"
    v-model="dialogVisible"
    custom-class="dialog"
    center
  >
    <span>
      <iframe
        :src="previewFile.url"
        frameborder="0"
        class="pdf"
      ></iframe>
    </span>
  </el-dialog>
</template>
<style lang="scss" scoped>
.pdf {
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss">
.dialog {
  margin-top: 4vh !important;
  height: 90%;
}
.el-dialog__body {
  height: 90%;
  padding-bottom: 0px !important;
  padding-top: 0px !important;
}
</style>
<script>
import { ref, watch, getCurrentInstance, toRefs, computed } from 'vue';
export default {
  name: "Dialog",
  props: {
    flag: Boolean,
    previewFile: Object
  },
  setup (props, { emit }) {
    const { ctx, proxy } = getCurrentInstance()
    const dialogVisible = ref(false);
    const form = ref("");
    const close = () => {
      dialogVisible.value = false;
      emit("update:flag", false);
    };
    const { flag } = toRefs(props)
    watch(flag, (val) => {
      dialogVisible.value = val;
    });
    return {
      dialogVisible,
      form,
      close,
      open,
      flag
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>