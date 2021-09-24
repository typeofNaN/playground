import { post, get, put, del } from '../utils/http'

//获取所有角色
export async function getRoles() {
  return await get('/api/PC/Role')
}

//新建角色
export async function addRole(data) {
  return await post('/api/PC/Role', data)
}

//修改角色信息
export async function updateRole(data) {
  return await put('/api/PC/Role', data)
}

//删除角色
export async function deleteRole(id) {
  return await del(`/api/PC/Role/${id}`)
}

//获取角色的路由
export async function getRoleRoute(role_id) {
  return await get(`/api/PC/Role/Route/${role_id}`)
}
