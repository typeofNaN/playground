import { getToken } from '@/utils/auth'

const state = {
  loginStatus: 0,
  userInfo: {
    username: '',
  },
  currentPageIndex: '1', //菜单
  trtcCalling: undefined, // trtc实例
  trtcInfo: {
    callStatus: 'idle', // 通话状态, idle, calling, connected
    isInviter: false, // 邀请者
    meetingUserIdList: [], // 会话用户ID列表
    muteVideoUserIdList: [], // 关闭摄像头用户ID列表
    muteAudioUserIdList: [], // 关闭麦克风用户ID列表
  },
  caseList: [
    {
      title: '审批',
      name: '1',
      close: false,
    },
  ],
}

export default state
