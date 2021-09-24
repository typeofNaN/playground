import { get } from '../utils/http'

//获取账户列表
export async function getUserSig(user_Id) {
  return await get(`/api/PC/Live/Sig/${user_Id}`)
}

//获取借款人live id
export async function getLiveId(borrower_Id) {
  return await get(`/api/PC/Live/${borrower_Id}`)
}

//开始录像
export async function startRecord(data) {
  return await get(`/api/PC/Live/Start`, data)
}

//结束录像
export async function stopRecord(data) {
  return await get(`/api/PC/Live/End`, data)
}

//发送live通知
export async function sendNotice(borrower_Id) {
  return await get(`/api/PC/Live/Notice/${borrower_Id}`)
}

//获取借款人视频集合
export async function getVideoList(borrower_Id) {
  return await get(`/api/PC/Live/Video/${borrower_Id}`)
}
