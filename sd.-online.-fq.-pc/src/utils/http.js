import axios from 'axios' // 引入axios
import { ElMessageBox } from 'element-plus'
import router from '../router'
import { getToken, setToken, removeToken } from '@/utils/auth'
import store from '../store'
//环境切换
axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_URL
// 请求超时 请求头
axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8'

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = getToken() //token存储在浏览器
    token && (config.headers.auth_token = token)
    return config
  },
  (error) => {
    ElMessageBox.alert('请求失败', '错误', {
      confirmButtonText: '确定',
      type: 'error',
    })
    return Promise.error(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    if (response.data.code === 200) {
      return Promise.resolve(response)
    } else {
      errCode(response.data.code)
      return Promise.reject(response)
    }
  },
  // 服务器状态码不是200的情况
  (error) => {
    if (error.response.status) {
      errCode(error.response.status)
      return Promise.reject(error.response)
    }
  }
)
function errCode(code) {
  console.log(store)
  switch (code) {
    // 401: 未登录
    case 401:
      router.replace({
        path: '/login',
        query: { redirect: router.currentRoute.fullPath },
      })
      break
    case 403:
      ElMessageBox.alert('登录过期，请重新登录', '错误', {
        confirmButtonText: '确定',
        type: 'error',
        callback: () => {
          // 清除token
          localStorage.removeItem('token')
          window.localStorage.clear()
          setTimeout(() => {
            store.dispatch('user/logout').then(() => {
              router.replace({
                path: '/login', // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
                query: {
                  redirect: router.currentRoute.fullPath,
                },
              })
            })
          }, 1000)
        },
      })
      break
    // 404请求不存在
    case 404:
      ElMessageBox.alert('地址不存在', '错误', {
        confirmButtonText: '确定',
        type: 'error',
      })
      break
    // 其他错误，直接抛出错误提示
    default:
      ElMessageBox.alert('请求失败', '错误', {
        confirmButtonText: '确定',
        type: 'error',
      })
  }
}
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
      })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}
/**
 * 封装patch请求
 * @param url
 * @param params
 * @returns {Promise}
 */
export function patch(url, params) {
  return new Promise((resolve, reject) => {
    axios.patch(url, params).then(
      (response) => {
        resolve(response.data)
      },
      (err) => {
        reject(err)
      }
    )
  })
}

/**
 * put 请求
 * @param  url
 * @param  params
 */
export function put(url, params) {
  return new Promise((resolve, reject) => {
    axios.put(url, params).then(
      (response) => {
        resolve(response.data)
      },
      (err) => {
        reject(err)
      }
    )
  })
}

/**
 * delete 请求
 * @param  url
 * @param  params
 */
export function del(url, params) {
  return new Promise((resolve, reject) => {
    axios.delete(url, params).then(
      (response) => {
        resolve(response.data)
      },
      (err) => {
        reject(err)
      }
    )
  })
}
