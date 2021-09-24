<template>
  <div class="container">
    <div
      v-if="!isShow"
      style="height: 100%;"
    >
      <div class="tabBar">
        <div class="mark"></div>
        <div class="title-text">法院查询</div>
      </div>
      <div class="body">
        <div class="input-container">
          <input
            class="input"
            placeholder="请输入借款人姓名/案件号"
            v-model="inputVal"
          />
          <el-button
            class="search"
            type="primary"
            style="background-color:#EE392F;border:none"
            @click="search"
          >搜索</el-button>
        </div>
      </div>
    </div>
    <div
      v-else
      style="height: calc(100% - 10px);"
    >
      <CaseInfo
        style="padding-top:10px"
        :isVideo="false"
        :applyNo="applyNo"
        @hide="isShow = false"
      />
    </div>
  </div>
</template>
<style lang='scss'>
.el-tabs--card > .el-tabs__header .el-tabs__item,
.el-tabs--card > .el-tabs__header,
.el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: 0 !important;
}
.el-tabs__item {
  font-size: 20px;
  font-weight: 400;
}
.el-tabs__item.is-active {
  color: #ee392f;
}
</style>
<style scoped lang='scss'>
.container {
  height: 100%;
  .tabBar {
    display: flex;
    flex-direction: row;
    height: 20px;
    background-color: #ffffff;
    padding: 20px 20px;
    .mark {
      width: 4px;
      height: 25px;
      background: #ee392f;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
    .title-text {
      font-size: 20px;
      font-weight: 400;
      height: 20px;
      color: #161616;
      vertical-align: center;
      margin-left: 10px;
    }
  }
  .body {
    background-color: #ffffff;
    padding: 10px 20px;
    height: calc(100% - 80px);
    .input-container {
      height: 50px;
      display: flex;
      flex-direction: row;
      width: 500px;
      margin: 0 auto;
      position: relative;
      top: 30%;
      transform: translateY(-50%);

      .input {
        width: 500px;
        height: 50px;
        border: 1px solid #cbcbcb;
        outline-style: none;
        box-sizing: border-box;
        outline: none;
        font-size: 20px;
        display: inline-block;
        border-radius: 10px 0 0 10px;
        outline: 0;
      }
      .input::placeholder {
        left: 50px;
        font-size: 18px;
        color: #777;
      }
      .search {
        border: 0;
        height: 50px;
        font-size: 20px;
        display: inline-block;
        border-radius: 0 10px 10px 0;
      }
    }
  }
}
</style>
<script>
import { getCurrentInstance, onMounted, ref, nextTick } from 'vue'
import CaseInfo from '../caseInfo/caseInfo.vue'
import { getApplyList } from '@/api/apply'

export default {
  components: {
    CaseInfo,
  },
  setup () {
    const { proxy } = getCurrentInstance()
    const inputVal = ref('')
    const isShow = ref(false)
    const applyNo = ref(0)
    async function search () {
      let res = await getApplyList({
        PageIndex: 1,
        PageSize: 1,
        Accurate_Apply_No: inputVal.value
      })
      if (res.data.dataList.length == 0) {
        proxy.$alert('未查询到该案件', '提示', {
          confirmButtonText: '确定',
          type: 'error'
        });
      } else {
        isShow.value = true
        applyNo.value = res.data.dataList[0].apply_No
      }
      inputVal.value = ''
    }
    return {
      search,
      inputVal,
      applyNo,
      isShow
    }
  }
}

</script>