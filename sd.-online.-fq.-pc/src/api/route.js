import { post, get, put, del } from '../utils/http'

//获取全部路由
export async function getRoute() {
  return await get('/api/PC/Route')
}

//新建路由
export async function newRoute(data) {
  return await post('/api/PC/Route', data)
}

//修改路由
export async function updateRoute(data) {
  return await put('/api/PC/Route', data)
}

//删除路由
export async function deleteRoute(route_Id) {
  return await del(`/api/PC/Route/${route_Id}`)
}
