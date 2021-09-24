import { post, get, put } from '../utils/http'

//获取预约列表集合
export async function getAppointment(data) {
  return await get('/api/PC/Appointment', data)
}

//预约借款人视频时间
export async function setAppointment(data) {
  return await post('/api/PC/Appointment', data)
}

//重新预约借款人视频时间
export async function resetAppointment(data) {
  return await put('/api/PC/Appointment', data)
}

//结束预约
export async function finishAppointment(data) {
  return await put('/api/PC/Appointment/Finish', data)
}

//发送预约通知
export async function sendAppointmentNotice(appointment_Id) {
  return await get(`/api/PC/Appointment/Send/${appointment_Id}`)
}
