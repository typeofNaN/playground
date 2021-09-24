const Mock = require('mockjs')

let Login = {
  code: 200,
  msg: 'success',
  data: {
    token: '123456',
  },
}
const tokens = {
  admin: {
    token: 'admin-token',
  },
  guest: {
    token: 'guest-token',
  },
  test: {
    token: 'test-token',
  },
}

const users = {
  'admin-token': {
    roles: ['admin'],
    name: 'Admin',
  },
  'guest-token': {
    roles: ['guest'],
    name: 'Guest',
  },
  'test-token': {
    roles: ['test'],
    name: 'test',
  },
}

/**
 * 基础 - 获取用户信息
 * @param： {}
 * @returns：Promise {<pending>}
 **/
export default {
  'post|info': (config) => {
    const { token } = JSON.parse(config.body)
    const info = users[token]
    if (!info) {
      return Mock.mock({
        code: 500,
        message: '找不到该用户',
      })
    }
    return Mock.mock({
      code: 200,
      data: info,
      message: 'ok',
    })
  },
}
