<template>
  <div class="container">
    <div
      v-if="!isVideo"
      style="height:100%"
    >
      <div class="tabBar">
        <div class="mark"></div>
        <div class="title-text">远程视频列表</div>
      </div>
      <div class="body">
        <el-form
          :model="searchForm"
          :inline="true"
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
              placeholder="请输入借款人名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="searchForm.Appointment_State"
              placeholder="请选择预约状态"
            >
              <el-option
                label="全部"
                value=""
              ></el-option>
              <el-option
                label="待确定"
                :value="0"
              ></el-option>
              <el-option
                label="已确定"
                :value="1"
              ></el-option>
              <el-option
                label="已完成"
                :value="2"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="searchForm.Start_Time"
              type="datetime"
              placeholder="选择开始时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="searchForm.End_Time"
              type="datetime"
              placeholder="选择结束时间"
            >
            </el-date-picker>
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
          class="tableContainer"
          ref="tableContainer"
        >
          <el-table
            v-loading="loading"
            :data="onlineUserList"
            :height="tableH"
          >
            <el-table-column
              prop="apply_No"
              label="案件号"
            >
            </el-table-column>
            <el-table-column
              prop="borrower.borrower_Name"
              label="借款人"
            >
            </el-table-column>
            <el-table-column
              prop="start_Time"
              label="开始时间"
            >
            </el-table-column>
            <el-table-column
              prop="end_Time"
              label="结束时间"
            >
            </el-table-column>
            <el-table-column
              prop="appointment_State"
              label="状态"
            >
            </el-table-column>
            <el-table-column label="状态">
              <template #default="scope">
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="scope.row.borrower.state == undefined?'未上线':scope.row.borrower.state == 1?'已上线':'已准备'"
                  placement="top"
                >
                  <div
                    class="status"
                    :style="{backgroundColor:scope.row.borrower.state == undefined ? '#909399':scope.row.borrower.state == 1?'#409EFF':'#67C23A'}"
                  ></div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  type="text"
                  style="color:#ee392f"
                  @click="sendMessage(scope.row)"
                >发送通知</el-button>
                <el-button
                  type="text"
                  style="color:#ee392f"
                  @click="handleClick(scope.row)"
                  v-if="scope.row.borrower.state != 2"
                >远程视频</el-button>
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
    </div>
    <div
      v-else
      style="height:100%;"
    >
      <CaseInfo
        :isVideo="true"
        :applyNo="applyNo"
        @hide="isVideo = false"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
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
    .tableContainer {
      height: calc(100% - 80px);
      .status {
        width: 12px;
        height: 12px;
        background-color: #909399;
        border-radius: 50%;
        margin-left: 8px;
      }
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
import { getCurrentInstance, onMounted, ref, nextTick, watch, computed, onBeforeUnmount, provide, inject } from "vue"
import dayjs from 'dayjs'
import CaseInfo from '@/views/caseInfo/caseInfo.vue'
import { useStore } from 'vuex'
import { sendNotice, getLiveId } from '@/api/live'
import { getAppointment } from '@/api/appointment'

var status = { 0: '待确定', 1: '已确定', 2: '已完成' };
var connection;
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
  setup (props, { emit }) {
    const store = useStore()
    const { ctx, proxy } = getCurrentInstance()
    const total = ref(0)
    const tableH = ref(0)
    const tableData = ref([])
    const currentPage = ref(1)
    const isVideo = ref(false)
    const applyNo = ref('')
    const searchForm = ref({
      Apply_No: '',
      Borrower_Name: '',
      Appointment_State: null,
      Start_Time: null,
      End_Time: null
    })
    const roomId = ref('')
    const live_No = ref('')
    const appointment_Id = ref('')
    const onlineNotice = computed(() => store.getters.onlineNotice)
    const onlineUserList = computed(() => store.getters.onlineUserList)
    const loginResponse = computed(() => store.getters.loginResponse)

    provide('roomId', roomId)
    provide('live_No', live_No)
    provide('appointment_Id', appointment_Id)
    const state = inject('state')

    watch(onlineNotice, (val) => { })
    watch(loginResponse, (val) => {
      if (val.code == 200) {
        emit('getUsers')
      }
    })
    watch(onlineUserList, (val) => { })

    function getHeight () {
      nextTick(() => {
        tableH.value = proxy.$refs.tableContainer.offsetHeight
      })
    }
    async function getData (Apply_No, Borrower_Name, Appointment_State, Start_Time, End_Time) {
      proxy.loading = true
      if (Start_Time != undefined) {
        Start_Time = dayjs(Start_Time).format('YYYY-MM-DD HH:mm')
      }
      if (End_Time != undefined) {
        End_Time = dayjs(End_Time).format('YYYY-MM-DD HH:mm')
      }
      let res = await getAppointment({
        PageIndex: currentPage.value,
        PageSize: 10,
        Apply_No,
        Borrower_Name,
        Appointment_State,
        Start_Time,
        End_Time,
      })
      var data = res.data.dataList
      total.value = data.length
      for (var i = 0; i < data.length; i++) {
        data[i].start_Time = dayjs(data[i].start_Time).format('YYYY-MM-DD HH:mm')
        data[i].end_Time = dayjs(data[i].end_Time).format('YYYY-MM-DD HH:mm')
        data[i].appointment_State = status[data[i].appointment_State]
      }
      let result = await store.dispatch('chat/setAppointmentList', data)
      proxy.loading = false
    }
    onMounted(() => {
      console.log(state.count)

      getHeight()
      getData()
      window.onresize = () => {
        if (isVideo.value) return
        getHeight()
      }
    });
    onBeforeUnmount(() => {
      window.onresize = null
    })
    function handleCurrentChange (page) {
      currentPage.value = page
      getData()
    }
    function login () {
      connection.invoke("PCLogin", "1").catch(function (err) {
        return console.error(err);
      });
    }
    function VideoInvite (borrower_Id, room_Id) {
      emit('VideoInvite', { borrower_Id, room_Id })
    }
    //获取在线用户列表
    function getUsers () {
      emit('GetUsers')
    }
    function onSubmit () {
      getData(searchForm.value.Apply_No, searchForm.value.Borrower_Name, searchForm.value.Appointment_State, searchForm.value.Start_Time, searchForm.value.End_Time)
    }
    async function handleClick (val) {
      let res = await getLiveId(val.borrower.borrower_Id)
      if (res.code == 200) {
        emit('VideoInvite', { borrower_Id: val.borrower.borrower_Id, room_Id: res.data.room_Id })
        isVideo.value = true
        applyNo.value = val.apply_No
        roomId.value = res.data.room_Id
        live_No.value = res.data.live_No
        appointment_Id.value = val.appointment_Id
      }
    }
    async function sendMessage (val) {
      let res = await sendNotice(val.borrower.borrower_Id)
      if (res.code == 200) {
        proxy.$alert('发送成功！', '提示', {
          confirmButtonText: '确定',
        });
      } else {
        proxy.$alert(res.message, '提示', {
          confirmButtonText: '确定',
        });
      }
    }
    return {
      total,
      tableH,
      tableData,
      currentPage,
      isVideo,
      searchForm,
      handleCurrentChange,
      login,
      getUsers,
      onSubmit,
      handleClick,
      applyNo,
      onlineUserList,
      roomId,
      live_No,
      sendMessage
    }
  }
}
</script>