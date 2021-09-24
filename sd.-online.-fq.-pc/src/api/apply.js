import { post, get } from '../utils/http'

//获取申请单集合
export async function getApplyList(data) {
  return await get('/api/PC/Apply', data)
}

//获取申请单详情
export async function getApplyDetail(apply_No) {
  return await get(`/api/PC/Apply/${apply_No}`)
}

//通过申请单
export async function passApply(data) {
  return await post('/api/PC/Apply/Pass', data)
}
