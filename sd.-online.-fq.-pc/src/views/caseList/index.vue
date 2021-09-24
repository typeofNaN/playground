<template>
  <div class="container">
    <div class="tabBar">
      <div class="mark"></div>
      <el-tabs
        v-model="editableTabsValue"
        v-if="editableTabs.length != 0"
        type="card"
        @tab-remove="removeTab"
      >
        <el-tab-pane
          :key="item.name"
          v-for="(item) in editableTabs"
          :label="item.title"
          :name="item.name"
          :closable="item.close"
        >
          {{item.content}}
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="body">
      <div
        v-if="editableTabsValue == 1"
        style="height:calc(100% - 40px)"
      >
        <el-form
          :inline="true"
          :model="searchForm"
          class="demo-form-inline"
          size="medium"
          style="height:40px"
        >
          <el-form-item>
            <el-input
              v-model="searchForm.Apply_No"
              placeholder="请输入申请单号"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="searchForm.Borrower_Name"
              placeholder="请输入借款人姓名"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
              style="background-color:#EE392F;border:none"
            >查询</el-button>
          </el-form-item>
        </el-form>
        <div
          ref="tableContainer"
          class="tableContainer"
        >
          <el-table
            v-loading="loading"
            :data="tableData"
            :height="tableH"
          >
            <el-table-column
              prop="apply_No"
              label="案件号"
            >
            </el-table-column>
            <el-table-column
              prop="borrower_Name"
              label="借款人"
            >
            </el-table-column>
            <el-table-column
              prop="loan_Amount"
              label="贷款金额"
            >
            </el-table-column>
            <el-table-column
              prop="loan_Rate"
              label="贷款利率"
            >
            </el-table-column>
            <el-table-column
              prop="loan_Deadline"
              label="贷款期限"
            >
            </el-table-column>
            <el-table-column
              prop="create_Time"
              label="创建时间"
            >
            </el-table-column>
            <el-table-column
              prop="apply_State"
              label="案件状态"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <button
                  @click="handleClick(scope.row)"
                  class="button"
                >去审批</button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin-top:10px">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="10"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
            class="pagination"
          >
          </el-pagination>
        </div>
      </div>
      <div
        v-for="(item,index) in editableTabs"
        :key="index"
        v-if="editableTabsValue != '1'"
      >
        <CaseInfo
          v-if="editableTabsValue == item.name"
          :applyNo="item.apply_No"
          @deleteItem="deleteItem"
        />
      </div>
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
  font-size: 18px !important;
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
    height: 40px;
    background-color: #ffffff;
    padding: 10px 20px;
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
    .tableContainer {
      height: calc(100% - 40px);
      .button {
        border-radius: 10px;
        width: 80px;
        height: 40px;
        background: #ee392f;
        border-radius: 3px;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        border: 0;
      }
    }
    .pagination {
      position: absolute;
      right: 10px;
      bottom: 10px;
    }
  }
}
</style>
<script>
import { getCurrentInstance, onMounted, ref, nextTick, watch, onBeforeUnmount, reactive, inject } from 'vue';
import CaseInfo from '@/views/caseInfo/caseInfo.vue'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import { getApplyList } from '@/api/apply'

var status = { 0: '未审批', 1: '已通过' };
export default {
  components: {
    CaseInfo
  },
  data () {
    return {
      //elementui loading的bug 只能用data
      loading: false
    }
  },
  setup () {
    const { ctx, proxy } = getCurrentInstance()
    var tableData = ref([])
    const tableH = ref(700)
    const total = ref(0)
    const currentPage = ref(1)
    const store = useStore()
    const searchForm = ref({
      Apply_No: '',
      Order_No: '',
      Borrower_Name: ''
    })
    const editableTabs = ref([{
      title: '审批',
      name: '1',
      close: false
    }])
    const state = inject('state')
    const editableTabsValue = ref('1')
    watch(editableTabsValue, (val) => {
      if (val == '1') {
        sessionStorage.setItem('currentCaseID', '')
      } else {
        sessionStorage.setItem("currentCaseID", editableTabs.value[val - 1].apply_No)
      }
    })
    onMounted(async () => {
      state.count += 1
      console.log(state.count)
      proxy.loading = true
      if (sessionStorage.getItem("setOpenCaseList") != null && JSON.parse(sessionStorage.getItem("setOpenCaseList")).length > 0) {
        store.dispatch('setOpenCaseList', JSON.parse(sessionStorage.getItem("setOpenCaseList")))
        editableTabs.value = store.getters.caseList
      } else {
        editableTabs.value = store.getters.caseList
      }
      if (sessionStorage.getItem("currentCaseID") != '') {
        editableTabs.value.forEach((element, index) => {
          if (element.apply_No == sessionStorage.getItem("currentCaseID")) {
            editableTabsValue.value = (index + 1).toString()
          }
        })
      }
      await getData()
      if (editableTabsValue.value == '1') {
        getHeight()
      }
      window.onresize = () => {
        if (editableTabsValue.value != '1') return
        getHeight()
      }
    });
    onBeforeUnmount(() => {
      window.onresize = null
    })
    async function getHeight () {
      await nextTick()
      tableH.value = proxy.$refs.tableContainer.offsetHeight
    }
    async function getData (Apply_No, Order_No, Borrower_Name) {
      proxy.loading = true
      await nextTick()
      let res = await getApplyList({
        PageIndex: currentPage.value,
        PageSize: 10,
        Apply_No,
        Order_No,
        Borrower_Name
      })
      var data = res.data.dataList
      tableData.value = data
      total.value = data.length
      for (var i = 0; i < data.length; i++) {
        data[i].loan_Deadline = dayjs(data[i].loan_Deadline).format('YYYY-MM-DD')
        data[i].create_Time = dayjs(data[i].create_Time).format('YYYY-MM-DD HH:mm:ss')
        data[i].apply_State = status[data[i].apply_State]
      }
      proxy.loading = false
    }
    function handleCurrentChange (page) {
      currentPage.value = page
      getData()
    }
    async function onSubmit () {
      getData(searchForm.value.Apply_No, searchForm.value.Order_No, searchForm.value.Borrower_Name)
    }
    function handleClick (row) {
      for (var i = 0; i < editableTabs.value.length; i++) {
        if (editableTabs.value[i].apply_No == row.apply_No) {
          editableTabsValue.value = (i + 1).toString()
          return
        }
      }
      editableTabs.value.push({
        title: `案件${row.apply_No}`,
        name: (editableTabs.value.length + 1).toString(),
        apply_No: row.apply_No,
        close: true
      })
      editableTabsValue.value = editableTabs.value.length.toString()
      store.dispatch('setOpenCaseList', editableTabs.value)
      sessionStorage.setItem("setOpenCaseList", JSON.stringify(editableTabs.value))
    }
    function removeTab (targetName) {
      let tabs = editableTabs.value;
      let activeName = editableTabsValue.value;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      editableTabsValue.value = activeName
      editableTabs.value = tabs.filter(tab => tab.name !== targetName)
      try {
        store.dispatch('setOpenCaseList', editableTabs.value)
        sessionStorage.setItem("setOpenCaseList", JSON.stringify(editableTabs.value))
      } catch (err) {
        sessionStorage.setItem("setOpenCaseList", [])
      }
    }
    //案件详情页点击详情时，返回并删除该页
    function deleteItem (id) {
      editableTabsValue.value = '1'
      let tabs = editableTabs.value
      tabs.forEach((tab, index) => {
        if (tab.apply_No === id) {
          editableTabs.value.splice(index, 1)
        }
      });
    }
    return {
      tableData,
      tableH,
      total,
      handleCurrentChange,
      currentPage,
      searchForm,
      handleClick,
      onSubmit,
      editableTabs,
      editableTabsValue,
      removeTab,
      deleteItem,
    }
  },
}
</script>