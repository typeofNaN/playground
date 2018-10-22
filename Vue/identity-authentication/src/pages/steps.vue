<template>
  <div id="steps">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>
    <div v-if="active === 0">步骤一</div>
    <div v-if="active === 1">步骤二</div>
    <div v-if="active === 2">步骤三</div>
    <el-button @click="prev" v-if="active == 1 || active == 2">上一步</el-button>
    <el-button @click="next" v-if="active == 0 || active == 1">下一步</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0
    };
  },

  methods: {
    prev() {
      --this.active
      if (this.active < 0) this.active = 0
    },
    next() {
      if (this.active++ > 2) this.active = 0
    }
  }
}
</script>
