<template>
  <div class="body">
    <div
      class="video-item"
      :id="remoteStreamView[0].id"
      v-if="remoteStreamView[0]"
    >
      <div class="status-area">
        <div
          class="video-status"
          :style="{backgroundImage:`url(${isUserMute(muteVideoUserIdList,remoteStreamView[0].userId)?images.cameraOff.default:images.cameraOn.default})`}"
        ></div>
        <div
          class="audio-status"
          :style="{backgroundImage:`url(${isUserMute(muteAudioUserIdList,remoteStreamView[0].userId)?images.micOff.default:images.micOn.default})`}"
        ></div>
        <el-image
          class="record"
          :src="isRecording?require('@/assets/录制1.png').default:require('@/assets/录制.png').default"
          @click="record"
        >
        </el-image>
      </div>
    </div>
    <div
      id='local_stream'
      class="video-item1"
      v-if="showLocalStream"
    >
      <div class="status-area">
        <div
          class="video-status"
          @click="toggleVideoStatus"
          :style="{backgroundImage:`url(${!isVideoOn?images.cameraOff.default:images.cameraOn.default})`}"
        ></div>
        <div
          class="audio-status"
          @click="toggleAudioStatus"
          :style="{backgroundImage:`url(${!isAudioOn?images.micOff.default:images.micOn.default})`}"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, inject, ref, getCurrentInstance, onMounted, nextTick, onBeforeUnmount, reactive } from 'vue'
import { useStore } from 'vuex'
import TRTC from "trtc-js-sdk"
import { getUserSig, startRecord, stopRecord, } from '@/api/live'
import { ElMessage } from 'element-plus'

export default ({
  setup (props, { emit }) {
    const { ctx, proxy } = getCurrentInstance()
    const images = inject('images')
    const store = useStore()
    const userInfo = computed(() => store.getters.userInfo)
    const trtcInfo = computed(() => store.getters.trtcInfo)
    const userId = ref('gzy')
    const client = ref()
    var remoteStream
    var localStream
    const isVideoOn = ref(true) // 视频状态
    const isAudioOn = ref(true) // 麦克风状态
    const muteVideoUserIdList = ref([])
    const muteAudioUserIdList = ref([])
    const showLocalStream = ref(false)
    const { username } = userInfo.value
    //录像状态
    const isRecording = ref(false)
    var roomId = inject('roomId', roomId)
    var live_No = inject('live_No', live_No)
    onMounted(() => {
      createClient(userId.value)
      TRTC.Logger.setLogLevel(TRTC.Logger.LogLevel.ERROR);
    })
    async function createClient (userId) {
      //获取签名      
      var sdkAppId = import.meta.env.VITE_APP_TRTC_SDK_APPID
      var userSig = await getUserSig(userId).message
      client.value = TRTC.createClient({
        mode: 'rtc',
        useStringRoomId: true,
        sdkAppId,
        userId,
        userSig
      });
      //注册远程监听，要放在加入房间前--这里用了发布订阅模式
      subscribeStream(client.value)
      //初始化后才能加入房间
      joinRoom(client.value, roomId)
    }
    //加入房间
    function joinRoom (client, roomId) {
      client.join({ roomId })
        .catch(error => {
          console.error('进房失败 ' + error);
        })
        .then(() => {
          console.log('进房成功');
          //创建本地流
          createStream(userId)
          //播放远端流
          playStream(client)
        });
    }

    //创建本地音视频流
    function createStream (userId) {
      localStream = TRTC.createStream({ userId, audio: true, video: true });
      localStream
        .initialize()
        .catch(error => {
          console.error('初始化本地流失败 ' + error);
        })
        .then(() => {
          console.log('初始化本地流成功');
          // 创建好后才能播放 本地流播放 local_stream 是div的id
          showLocalStream.value = true
          nextTick(() => {
            console.log('local_stream play')
            localStream.play('local_stream');
            //创建好后才能发布
            publishStream(localStream, client.value)
          })
        });
    }

    //发布本地音视频流
    function publishStream (localStream, client) {
      client
        .publish(localStream)
        .catch(error => {
          console.error('本地流发布失败 ' + error);
        })
        .then(() => {
          console.log('本地流发布成功');
        });
    }

    //订阅远端流--加入房间之前
    function subscribeStream (client) {
      client.on('stream-added', event => {
        remoteStream = event.stream
        console.log('远端流增加: ' + remoteStream.getId());
        //订阅远端流
        client.subscribe(remoteStream);
      });
      client.on('stream-removed', event => {
        const remoteStream = event.stream;
        console.log('远端流移除: ' + remoteStream.getId());
        remoteStreamView.value.forEach((element, index) => {
          if (element.id.indexOf(remoteStream.getId()) != -1) {
            remoteStreamView.value.splice(index, 1)
          }
        });
      });
      client.on('mute-audio', event => {
        console.log(event.userId + ' mute audio');
        muteAudioUserIdList.value.push(event.userId)
      });
      client.on('unmute-audio', event => {
        console.log(event.userId + ' unmute audio');
        if (muteAudioUserIdList.value.indexOf(event.userId) != -1) {
          muteAudioUserIdList.value.splice(muteAudioUserIdList.value.indexOf(event.userId), 1)
        }
      });
      client.on('mute-video', event => {
        console.log(event.userId + ' mute video');
        muteVideoUserIdList.value.push(event.userId)
      });
      client.on('unmute-video', event => {
        console.log(event.userId + ' unmute video');
        if (muteVideoUserIdList.value.indexOf(event.userId) != -1) {
          muteVideoUserIdList.value.splice(muteVideoUserIdList.value.indexOf(event.userId), 1)
        }
      });
    }

    const remoteStreamView = ref([])
    //播放远端流
    function playStream (client) {
      client.on('stream-subscribed', event => {
        remoteStream = event.stream;
        console.log('远端流订阅成功：' + remoteStream.getId());
        remoteStreamView.value.push({
          id: `id-${remoteStream.getId()}`,
          stream: remoteStream,
          userId: remoteStream.getUserId()
        });
        nextTick(() => {
          //播放
          remoteStream.play('id-' + remoteStream.getId());
        })
      });
    }
    function leaveRoom () {
      showLocalStream.value = false
      client.value
        .leave()
        .then(() => {
          console.log('退房成功')
          // 停止本地流，关闭本地流内部的音视频播放器
          localStream.stop();
          // 关闭本地流，释放摄像头和麦克风访问权限
          localStream.close();
          localStream = null;
          client.value = null
          // 退房成功，可再次调用client.join重新进房开启新的通话。
        })
        .catch(error => {
          console.error('退房失败 ' + error);
          // 错误不可恢复，需要刷新页面。
        });
    }
    // 打开/关闭摄像头
    async function toggleVideoStatus () {
      const trtcInfoData = trtcInfo.value
      const { username } = userInfo.value
      isVideoOn.value = !isVideoOn.value
      if (isVideoOn.value) {
        localStream.unmuteVideo()
        trtcInfoData.muteVideoUserIdList = trtcInfoData.muteVideoUserIdList.filter((item) => item !== username)
      } else {
        localStream.muteVideo()
        trtcInfoData.muteVideoUserIdList.push(username)
      } 0
      await store.dispatch('setTrtcInfo', trtcInfoData)
    }

    // 打开/关闭麦克风
    async function toggleAudioStatus () {
      const trtcInfoData = trtcInfo.value
      const { username } = userInfo.value
      isAudioOn.value = !isAudioOn.value
      if (isAudioOn.value) {
        localStream.unmuteAudio()
        trtcInfoData.muteAudioUserIdList = trtcInfoData.muteAudioUserIdList.filter((item) => item !== username)
      } else {
        localStream.muteAudio()
        trtcInfoData.muteAudioUserIdList.push(username)
      }
      await store.dispatch('setTrtcInfo', trtcInfoData)
    }
    function isUserMute (muteUserList, userId) {
      return muteUserList.indexOf(userId) !== -1
    }
    onBeforeUnmount(() => {
      console.log('onBeforeUnmount')
      leaveRoom()
    })
    async function record () {
      if (isRecording.value) {
        let res = await stopRecord({
          live_No: live_No,
        })
        console.log(res)
        if (res.code == 200) {
          ElMessage.success({
            message: '已结束录像',
            type: 'success'
          });
          isRecording.value = false
        }
      } else {
        let res = await startRecord({
          live_No: live_No,
        })
        console.log(res)
        if (res.code == 200) {
          ElMessage.success({
            message: '已开始录像',
            type: 'success'
          });
          isRecording.value = true
        }
      }
    }
    return {
      images,
      userInfo,
      TRTC,
      userId,
      client,
      remoteStream,
      showLocalStream,
      localStream,
      remoteStreamView,
      toggleAudioStatus,
      toggleVideoStatus,
      isUserMute,
      isVideoOn,
      isAudioOn,
      muteVideoUserIdList,
      muteAudioUserIdList,
      trtcInfo,
      leaveRoom,
      isRecording,
      record
    }
  }
})
</script>
<style scoped lang="scss">
.body {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: black;
  .video-item {
    width: 100%;
    height: 100%;
    z-index: 100;
    .status-area {
      .video-status {
        position: absolute;
        right: 50px;
        bottom: 20px;
        z-index: 10;
        width: 24px;
        height: 27px;
        background-size: cover;
      }

      .audio-status {
        position: absolute;
        right: 20px;
        bottom: 20px;
        z-index: 10;
        width: 22px;
        height: 27px;
        background-size: cover;
      }

      .record {
        position: absolute;
        right: 80px;
        bottom: 14px;
        z-index: 10;
        width: 40px;
        height: 40px;
      }
    }
  }
  .video-item1 {
    box-sizing: border-box;
    width: 240px;
    height: 160px;
    text-align: left;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 20;
    .status-area {
      .video-status {
        position: absolute;
        right: 50px;
        bottom: 20px;
        z-index: 10;
        width: 24px;
        height: 27px;
        background-size: cover;
      }

      .audio-status {
        position: absolute;
        right: 20px;
        bottom: 20px;
        z-index: 10;
        width: 22px;
        height: 27px;
        background-size: cover;
      }
    }

    .video-username {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 10;
      color: #fff;
    }
  }

  .operation-wrapper {
    display: flex;
    justify-content: center;
  }
  .record {
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 32px;
    height: 32px;
  }
}
</style>
