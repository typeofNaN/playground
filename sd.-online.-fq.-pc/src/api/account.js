import { post, get, put, del } from '../utils/http'

//获取账户列表
export async function getAccount() {
  return await get('/api/PC/Account')
}

//新建账户
export async function newAccount(data) {
  return await post('/api/PC/Account', data)
}

//修改账户
export async function updateAccount(data) {
  return await put('/api/PC/Account', data)
}

//删除账户
export async function deleteAccount(route_Id) {
  return await del(`/api/PC/Account/${route_Id}`)
}
