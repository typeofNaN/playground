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
  'admin-token': [
    {
      route_Url: '/home',
      route_Name: '主页',
      route_Chidren: [
        {
          route_Url: '/home',
          route_Name: '主页',
        },
      ],
    },
    {
      route_Url: '/caseList',
      route_Name: '案件列表',
      route_Chidren: [
        {
          route_Url: '/caseList',
          route_Name: '案件列表',
        },
      ],
    },
    /*
    {
      path: '/videoList',
      component: 'Layout',
      redirect: '/videoList/videoList',
      meta: {
        title: '远程视频列表',
        icon: 'el-icon-s-grid',
      },
      children: [
        {
          path: '/videoList',
          component: 'videoList/index',
          name: 'videoList',
          meta: {
            title: '远程视频列表',
            icon: 'el-icon-s-grid',
          },
        },
      ],
    },
    {
      path: '/manage',
      component: 'Layout',
      redirect: '/manage/manage',
      meta: {
        title: '远程视频列表',
        icon: 'el-icon-s-grid',
      },
      children: [
        {
          path: '/manage',
          component: 'manage/management',
          name: 'manage',
          meta: {
            title: '账号管理',
            icon: 'el-icon-s-grid',
          },
        },
      ],
    }, */
    /*   {
      path: '/:path(.*)*',
      name: 'NotFound',
      hidden: true,
      component: 'error/404',
      meta: {
        title: '无法访问该页面',
      },
    }, */
  ],
  'guest-token': [
    {
      path: '/',
      component: 'Layout',
      redirect: '/home',
      name: 'redirect',
      meta: {
        title: '主页',
        icon: 'el-icon-s-home',
      },
      children: [
        {
          path: 'home',
          name: 'home',
          component: 'home',
          meta: {
            title: '主页',
            icon: 'el-icon-s-home',
          },
        },
        {
          path: 'caseList',
          name: 'caseList',
          component: 'caseList',
          meta: {
            title: '案件列表',
            icon: 'el-icon-s-grid',
          },
        },
        {
          path: 'videoList',
          name: 'videoList',
          component: 'videoList',
          meta: {
            title: '远程视频列表',
            icon: 'el-icon-s-grid',
          },
        },
      ],
    },
    {
      path: '/:path(.*)*',
      name: 'NotFound',
      hidden: true,
      component: '404',
      meta: {
        title: '无法访问该页面',
      },
    },
  ],
  'test-token': [
    {
      path: '/',
      component: 'Layout',
      redirect: '/court',
      name: 'redirect',
      children: [
        {
          path: 'court',
          name: 'court',
          component: 'court',
          meta: {
            title: '法院查询',
            icon: 'el-icon-s-grid',
          },
        },
      ],
    },
    {
      path: '/:path(.*)*',
      name: 'NotFound',
      hidden: true,
      component: '404',
      meta: {
        title: '无法访问该页面',
      },
    },
  ],
}

/**
 * 基础 - 获取用户信息
 * @param： {}
 * @returns：Promise {<pending>}
 **/
export default {
  'post|route': (config) => {
    console.log(config)
    const { token } = JSON.parse(config.body)
    const route = users[token]
    return Mock.mock({
      code: 200,
      route,
      message: 'ok',
    })
  },
}
