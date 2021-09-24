<template>
  <div
    class="container"
    v-loading="loading"
  >
    <div style="display:flex;flex-direction:row;height:100%">
      <div :style="{'width': isVideo? '1200px' : '1200px','margin-top': !isVideo? '0' : '20px','margin':'0 auto','border':'1px solid #ebebeb','box-shadow':'0px 6px 12px rgba(120, 46, 46, 0.1)','padding':'10px','background-color':'#FFFCF6'}">
        <div style="margin-left:10px">
          <div class="title">
            贷款信息
          </div>
          <el-table
            :data="[caseInfo]"
            style="width: 100%"
            :row-style="{height: '40px'}"
            :cell-style="{padding: '0'}"
          >
            <el-table-column
              prop="loan_Amount"
              label="贷款金额"
            >
            </el-table-column>
            <el-table-column
              prop="loan_Deadline"
              label="贷款期限"
            >
            </el-table-column>
            <el-table-column
              prop="loan_Rate"
              label="贷款利息"
            >
            </el-table-column>
            <el-table-column
              prop="fQ_Term"
              label="赋强条件"
            >
            </el-table-column>
          </el-table>
          <div
            class="title"
            style="margin-top:10px"
          >
            借款人信息
          </div>
          <div>
            <el-table
              :data="caseInfo.borrowers"
              style="width: 100%"
              :cell-style="{padding: '0'}"
              height="320"
            >
              <el-table-column
                prop="borrower_Name"
                label="姓名"
                width="100"
              >
              </el-table-column>
              <el-table-column
                prop="id_Type"
                label="证件类型"
                width="100"
              >
              </el-table-column>
              <el-table-column
                prop="id_Number"
                label="证件号码"
              >
              </el-table-column>
              <el-table-column
                prop="phone"
                label="手机号码"
                width="120"
              >
              </el-table-column>
              <el-table-column
                label="现场照"
                width="80"
              >
                <template #default="scope">
                  <el-image
                    :src="`${fileUrl}${scope.row.scene_Photo}`"
                    fit="cover"
                    style="height:60px;width:60px"
                    :preview-src-list="[`${fileUrl}${scope.row.scene_Photo}`]"
                    :hide-on-click-modal="true"
                    v-if="scope.row.scene_Photo"
                  ></el-image>
                </template>
              </el-table-column>
              <el-table-column
                prop="appointment.start_Time"
                label="预约视频开始时间"
              >
              </el-table-column>
              <el-table-column
                prop="appointment.end_Time"
                label="预约视频结束时间"
              >
              </el-table-column>
              <el-table-column
                prop="appointment.appointment_State"
                label="状态"
                width="80"
              >
              </el-table-column>
              <el-table-column
                label="操作"
                fixed="right"
              >
                <template #default="scope">
                  <div style="display:flex;flex-direction:column">
                    <el-button
                      @click="openDialog(scope.row.borrower_Id,scope.row.appointment == null,scope.row.appointment == null ? null:scope.row.appointment.appointment_Id)"
                      type="text"
                      style="color:#ee392f;padding:0;min-height: 25px;width:84px"
                    >{{ scope.row.appointment == null ? '预约时间' : '更改预约时间' }}
                    </el-button>
                    <el-button
                      type="text"
                      v-if="scope.row.appointment != null"
                      @click="sendMessage(scope.row)"
                      style="margin-left:0;color:#ee392f;padding:0;min-height: 25px;width:84px"
                    >发送预约通知
                    </el-button>
                    <el-button
                      type="text"
                      v-if="scope.row.videoList != undefined"
                      style="margin-left:0;color:#ee392f;padding:0;min-height: 25px;width:84px"
                      @click="showVideoModal(scope.row)"
                    >查看视频记录
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div
            class="title"
            style="margin-top:10px"
          >
            附件
          </div>
          <div class="file-div">
            <el-table
              :data="caseFile"
              style="width: 100%"
              height="215"
              :row-style="{height: '20px'}"
              :cell-style="{padding: '0'}"
            >
              <el-table-column
                prop="file_Name"
                label="案件文件"
              >
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                    @click="handleOpenFile(scope.row.file_Url,scope.row.file_Name)"
                    type="text"
                    style="color:#ee392f"
                  >打开
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              :data="caseInfo.apply_Files"
              style="width: 100%"
              :row-style="{height: '20px'}"
              :cell-style="{padding: '0'}"
              :height="215"
            >
              <el-table-column
                prop="file_Name"
                label="其他附件"
              >
              </el-table-column>
              <el-table-column>
                <template #default="scope">
                  <el-button
                    @click="handleOpenFile(scope.row.file_Url,scope.row.file_Name)"
                    type="text"
                    style="color:#ee392f"
                  >打开
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <PdfViewer
            :flag.sync="isOpen"
            :previewFile="previewFile"
            @update:flag="isOpen = $event"
          />
          <el-dialog
            title="选择时间"
            v-model="dialogVisible"
            :width="500"
          >
            <div class="dialog-body">
              <el-date-picker
                v-model="dialogDate"
                type="date"
                placeholder="选择日期"
                style="margin:10px"
                format="YYYY-MM-DD"
                :disabled-date="disabledDate"
              >
              </el-date-picker>
              <el-time-picker
                style="margin:10px"
                is-range
                v-model="dialogTime"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                format="HH:mm"
              >
              </el-time-picker>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button
                  type="primary"
                  @click="appointment()"
                >确 定</el-button>
              </span>
            </template>
          </el-dialog>
          <el-dialog
            title="视频列表"
            v-model="showVideoList"
            width="800px"
          >
            <el-table
              :data="videoList"
              :height="600"
            >
              <el-table-column
                property="guid"
                label="文件名"
              ></el-table-column>
              <el-table-column label="录制时间">
                <template #default="scope">
                  {{ dayjs(scope.row.finishdate).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="100"
              >
                <template #default="scope">
                  <el-button
                    @click="handleClick(scope.row.url,scope.row.guid)"
                    class="button"
                    type="text"
                  >查看
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
        </div>
        <div class="buttonDiv">
          <button
            class="left-bt"
            @click="goBack"
          >返回
          </button>
          <button
            class="right-bt"
            @click="approve"
          >审批
          </button>
        </div>
      </div>
      <div
        style="width:500px"
        v-if="isVideo"
      >
        <div class="video">
          <Video />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
/*最外层透明*/
:deep() .el-table,
:deep() .el-table__expanded-cell {
  background-color: transparent;
}

/* 表格内背景颜色 */
:deep() .el-table th,
:deep() .el-table tr,
:deep() .el-table td {
  background-color: transparent;
}

.container {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  height: 100%;

  .title {
    font-size: 18px;
    color: #303133;
    line-height: 1.5em;
  }

  .item {
    display: flex;
    flex-direction: row;
    margin-top: 8px;

    .title {
      width: 200px;
      font-size: 16px;
      color: #303133;
      line-height: 1.5em;
    }

    .info {
      width: 200px;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      color: #2c2c2c;
    }
  }

  .file-div {
    display: flex;
    flex-direction: row;
  }

  .dialog-body {
    display: flex;
  }

  .buttonDiv {
    margin: 0 auto 0 auto;
    display: flex;
    flex-direction: row;
    width: 200px;

    .left-bt {
      width: 100px;
      height: 40px;
      border: 1px solid #ee392f;
      border-radius: 5px 0px 0px 5px;
      background: #ffffff;
      font-size: 18px;
      font-weight: 400;
      color: #ee392f;
    }

    .right-bt {
      width: 100px;
      height: 40px;
      background: #ee392f;
      border: 1px solid #ee392f;
      border-radius: 0px 5px 5px 0px;
      font-size: 18px;
      font-weight: 400;
      color: #ffffff;
    }
  }

  .video {
    width: 100%;
    height: 100%;
    box-shadow: 0px 6px 12px rgba(120, 46, 46, 0.1);
  }
}
</style>
<style>
.el-table::before {
  height: 0px;
}
</style>
<script>
import { getCurrentInstance, onMounted, reactive, ref, inject } from 'vue';
import dayjs from 'dayjs'
import Video from '../video/video.vue'
import PdfViewer from '@/components/pdfViewer/pdfViewer.vue'
import { ElMessage } from 'element-plus'
import { sendAppointmentNotice, setAppointment, resetAppointment, finishAppointment } from '@/api/appointment'
import { getVideoList } from '@/api/live'
import { getApplyDetail, passApply } from '@/api/apply'

var status = { 0: '未审批', 1: '已通过' };
var id_Type = { 0: '身份证', 1: '已通过' };
var appointment_State = { 0: '待确定', 1: '已确定', 2: '已完成', '-1': '不同意' }
export default {
  props: {
    applyNo: {
      type: String,
      default: ''
    },
    isVideo: {
      type: Boolean,
      default: false
    },
  },
  components: {
    PdfViewer,
    Video
  },
  data () {
    return {
      loading: true
    }
  },
  setup (props) {
    const { ctx, proxy } = getCurrentInstance()
    var caseInfo = ref({})
    var srcList = ref([])
    const fileUrl = ref('http://192.168.100.118:9088/Files/')
    //pdfViewer状态
    const isOpen = ref(false)
    //选择预约时间dialog
    const dialogVisible = ref(false)
    //日期
    const dialogDate = ref()
    //开始,结束时间
    const dialogTime = ref([])
    //当前预约的借款人id
    const currentBorrower = ref({})
    const previewFile = ref({})
    const caseFile = ref([])
    const videoList = ref([])
    const showVideoList = ref(false)
    onMounted(async () => {
      getData()
    });
    const appointment_Id = inject('appointment_Id')
    //获取接口数据
    async function getData () {
      proxy.loading = true
      let res = await getApplyDetail(proxy.applyNo)
      if (res.code == 200) {
        caseInfo.value = res.data
        caseInfo.value.loan_Deadline = dayjs(caseInfo.value.loan_Deadline).format('YYYY-MM-DD')
        caseInfo.value.create_Time = dayjs(caseInfo.value.create_Time).format('YYYY-MM-DD HH:mm:ss')
        caseInfo.value.apply_State = status[caseInfo.value.apply_State]
        caseInfo.value.borrowers.forEach((element, index) => {
          caseInfo.value.borrowers[index].id_Type = id_Type[element.id_Type]
          if (element.appointment != null) {
            caseInfo.value.borrowers[index].appointment.start_Time = dayjs(element.appointment.start_Time).format('YYYY-MM-DD HH:mm')
            caseInfo.value.borrowers[index].appointment.end_Time = dayjs(element.appointment.end_Time).format('YYYY-MM-DD HH:mm')
            caseInfo.value.borrowers[index].appointment.appointment_State = appointment_State[caseInfo.value.borrowers[index].appointment.appointment_State]
          }
        });
        caseFile.value = [{
          file_Name: '申请单',
          file_Url: caseInfo.value.applicant_Form,
        }, {
          file_Name: '申请单',
          file_Url: caseInfo.value.notification,
        }, {
          file_Name: '申请单',
          file_Url: caseInfo.value.cognizance_Record,
        }, {
          file_Name: '申请单',
          file_Url: caseInfo.value.loan_Contract,
        }]
      }
      for (var i = 0; i < caseInfo.value.borrowers.length; i++) {
        console.log(caseInfo.value.borrowers[i].appointment)
        if (caseInfo.value.borrowers[i].appointment != null && caseInfo.value.borrowers[i].appointment.appointment_State == 2) {
          let res = await getVideoList(caseInfo.value.borrowers[i].borrower_Id)
          if (res.code == 200) {
            caseInfo.value.borrowers[i].videoList = res.data
          }
        }
      }
      proxy.loading = false
    }

    //打开附件
    function handleOpenFile (url, fileName) {
      isOpen.value = !isOpen.value
      previewFile.value = {
        url: fileUrl.value + url,
        fileName
      }
    }

    function goBack () {
      if (proxy.isVideo) {
        proxy.$confirm('返回前请确认此次视频是否完成?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(async () => {
          let res = await finishAppointment({
            appointment_Id
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          proxy.$emit('hide')
          proxy.$emit('deleteItem', proxy.applyNo)
        });
      } else {
        proxy.$emit('hide')
        proxy.$emit('deleteItem', proxy.applyNo)
      }
    }

    //审批
    function approve () {
      proxy.$confirm('是否通过审批?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await passApply({
          apply_No: proxy.applyNo
        })
        if (res.code == 200) {
          proxy.$alert('审批成功!', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              if (proxy.isVideo) {
                proxy.$emit('hide', 1)
              } else {
                proxy.$emit('deleteItem', proxy.applyNo)
              }
            }
          });
        }
      })
    }

    //提交审批预约
    async function appointment () {
      if (dialogDate.value == undefined || dialogTime.value == []) {
        ElMessage.error('请选择时间！');
        return
      }
      if (dayjs(dialogTime.value[1]).diff(dayjs(dialogTime.value[0]), 'minute') < 30) {
        ElMessage.error('预约结束时间必须大于开始时间30分钟以上');
        return
      }
      var res
      if (currentBorrower.value.isNew) {
        res = await setAppointment({
          apply_No: proxy.applyNo,
          borrower_Id: currentBorrower.value.id,
          start_Time: `${dayjs(dialogDate.value).format('YYYY-MM-DD')} ${dayjs(dialogTime.value[0]).format('HH:mm')}:59`,
          end_Time: `${dayjs(dialogDate.value).format('YYYY-MM-DD')} ${dayjs(dialogTime.value[1]).format('HH:mm')}:59`
        })
      } else {
        res = await resetAppointment({
          appointment_Id: currentBorrower.value.appointment_Id,
          start_Time: `${dayjs(dialogDate.value).format('YYYY-MM-DD')} ${dayjs(dialogTime.value[0]).format('HH:mm')}:59`,
          end_Time: `${dayjs(dialogDate.value).format('YYYY-MM-DD')} ${dayjs(dialogTime.value[1]).format('HH:mm')}:59`
        })
      }
      if (res.code == 200) {
        getData()
        proxy.$alert(currentBorrower.value.isNew ? '预约成功！' : '更改预约时间成功！', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            dialogVisible.value = false
          }
        });
      } else {
        proxy.$alert(res.message, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            dialogVisible.value = false
          }
        });
      }
    }

    //打开时间选择dialog
    function openDialog (id, isNew, appointment_Id) {
      dialogVisible.value = true
      if (isNew) {
        currentBorrower.value = {
          id,
          isNew
        }
      } else {
        currentBorrower.value = {
          appointment_Id,
          isNew
        }
      }
    }

    //日期选择器的限制 不能选择以前的时间
    function disabledDate (date) {
      return date.getTime() < Date.now() - 24 * 60 * 60 * 1000
    }

    async function sendMessage (item) {
      proxy.$confirm(`借款人：${item.borrower_Name} <br/>预约时间：${dayjs(item.appointment.start_Time).format('YYYY-MM-DD HH:mm')} 至 ${dayjs(item.appointment.end_Time).format('YYYY-MM-DD HH:mm')}<br/>是否发送短信通知?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(async () => {
        let res = await sendAppointmentNotice(item.appointment.appointment_Id)
        console.log(res)
        if (res.code == 200) {
          proxy.$alert('发送成功！', '提示', {
            confirmButtonText: '确定',
          });
        } else {
          proxy.$alert(`发送失败 ${JSON.stringify(res)}`, '提示', {
            confirmButtonText: '确定',
          });
        }
      })
    }

    //打开视频列表Modal点击事件
    function showVideoModal (val) {
      showVideoList.value = true
      videoList.value = val.videoList
    }

    //预览视频
    function handleClick (url, fileName) {
      isOpen.value = true
      previewFile.value = {
        url,
        fileName
      }
    }

    return {
      caseInfo,
      srcList,
      fileUrl,
      handleOpenFile,
      isOpen,
      previewFile,
      goBack,
      approve,
      appointment,
      dialogVisible,
      dialogDate,
      openDialog,
      dialogTime,
      disabledDate,
      dayjs,
      sendMessage,
      caseFile,
      videoList,
      showVideoList,
      showVideoModal,
      handleClick
    }
  }
}
</script>