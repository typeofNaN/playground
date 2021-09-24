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
 * 基础 - 登录
 * @param： {}
 * @returns：Promise {<pending>}
 **/
export default {
  'post|login': (config) => {
    const { username, password } = JSON.parse(config.body)
    if (password !== '123456') {
      console.log('用户名密码错误')
      return Mock.mock({
        code: 500,
        message: '用户名密码错误',
      })
    }
    const token = tokens[username]
    if (!token) {
      return Mock.mock({
        code: 500,
        message: '用户名密码错误',
      })
    }
    return Mock.mock({
      code: 200,
      message: 'ok',
      data: token,
    })
  },
}
