<template>
  <el-container class="body">
    <el-header
      class="body-header"
      height="60"
    >
      <Header />
    </el-header>
    <el-container>
      <el-main>
        <router-view
          class="app-content"
          @PCLogin="PCLogin"
          @GetUsers="GetUsers"
          @VideoInvite="VideoInvite"
        ></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<style lang='scss' scoped>
.body {
  top: 60px;
  left: 0;
  width: 100%;
  height: calc(100% - 60px);
  position: absolute;
  .el-header {
    padding: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
  }
  .el-main {
    padding: 0;
  }
}
</style>
<script>
import Header from '@/components/header/header.vue'
import Menu from '@/components/menu/menu.vue'

import { getCurrentInstance, onMounted, ref, nextTick, onUnmounted } from "vue"
import { computed } from 'vue'
import { useStore } from 'vuex'
import * as signalR from "@microsoft/signalr"
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import mp3 from '@/assets/ring.mp3'
import { getAppointment } from '@/api/appointment'

var status = { 0: '待确定', 1: '已确定', 2: '已完成' };
export default {
  components: {
    Header,
    Menu
  },
  setup () {
    const store = useStore()
    const { proxy } = getCurrentInstance()
    const currentPageIndex = computed(() => store.getters.currentPageIndex)
    const canVideo = computed(() => store.getters.canVideo)
    var connection
    onMounted(() => {
      if (!canVideo) {
        return
      }
      connection = new signalR.HubConnectionBuilder()
        .withUrl("http://192.168.100.118:9088/ChatHub")
        .withAutomaticReconnect() //断线自动重连
        .build();
      connection.onreconnected((connectionId) => {
        console.log(`onreconnected: ${connectionId}`);
      });
      //登录
      connection.on("LoginResponse", async (res) => {
        let result = await store.dispatch('chat/setLoginResponse', res)
        if (res.code == 200) {
          GetUsers()
          store.dispatch('chat/setConnectionStatus', 2)
        } else {
          ElMessage.error(result.message);
        }
      });
      //重连
      connection.onreconnecting(async (error) => {
        store.dispatch('chat/setConnectionStatus', 1)
      })
      //断开
      connection.onclose(async (error) => {
        store.dispatch('chat/setConnectionStatus', 0)
        connection.start()
          .then(() => PCLogin()).catch((err) => console.log(err))
      })
      //在线用户列表
      connection.on("GetUsersResponse", async (res) => {
        console.log(res);
        getData()
        store.dispatch('chat/setOnlineUser', res.onlineUsers)
        //tableData.value = res.onLineUser;
      });
      //上线通知
      connection.on("OnlineNotice", async (res) => {
        playAudio()
        proxy.$notify.info({
          title: '上线通知',
          message: `${res.borrower_Name} 上线`,
          duration: 0
        });
        let result = await store.dispatch('chat/setOnlineNotice', res)
      });
      //邀请
      connection.on("VideoInviteResponse", (res) => {
        console.log(res);
      });
      //
      connection.on("ReadyResponse", async (res) => {
        console.log(res);
        let result = await store.dispatch('chat/setReadyResponse', res)
      });
      connection.start()
        .then(() => PCLogin()).catch((err) => console.log(err))
    });
    onUnmounted(() => {
      console.log('onUnmounted')
      if (canVideo) {
        connection.stop()
      }
    })
    //登录
    function PCLogin () {
      console.log('PCLogin')
      connection.invoke("PCLogin", "1").catch((err) => {
        return console.error(err);
      });
    }
    //邀请进入视频
    function VideoInvite (val) {
      console.log('VideoInvite')
      connection.invoke("VideoInvite", val.borrower_Id, val.room_Id).catch(function (err) {
        return console.error(err);
      });
    }
    //获取在线用户列表
    function GetUsers () {
      console.log('GetUsers')
      connection.invoke("GetUsers").catch(function (err) {
        return console.error(err);
      });
    }
    async function getData () {
      let res = await getAppointment({
        PageIndex: 1,
        PageSize: 10,
      })
      var data = res.data.dataList
      for (var i = 0; i < data.length; i++) {
        data[i].start_Time = dayjs(data[i].start_Time).format('YYYY-MM-DD HH:mm')
        data[i].end_Time = dayjs(data[i].end_Time).format('YYYY-MM-DD HH:mm')
        data[i].appointment_State = status[data[i].appointment_State]
      }
      let result = await store.dispatch('chat/setAppointmentList', data)
    }
    var audio
    const timer = ref()
    const second = ref()
    function playAudio () {
      audio = new Audio();
      audio.src = mp3
      let playPromise;
      playPromise = audio.play();
      if (playPromise) {
        playPromise.then(() => {
          // 音频加载成功
          // 音频的播放需要耗时
          timer.value = setInterval(() => {
            second.value--;
            if (second.value <= 0) {
              audio.pause()
              clearInterval(timer.value);
            }
          }, 1000);
        }).catch((e) => {
          // 音频加载失败
          console.error(e);
        });
      }
    }
    return {
      currentPageIndex,
      PCLogin,
      GetUsers,
      VideoInvite
    }
  }
}
</script>