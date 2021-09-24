import { post, get } from '@/utils/http'

export function login(data) {
  return post('/api/PC/Auth/Login', data)
}

export function logout() {
  return post('logout', 1)
}

export function getRoute() {
  return get('/api/PC/Auth/Route')
}
