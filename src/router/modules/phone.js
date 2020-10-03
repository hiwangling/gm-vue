/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const phoneRouter = {
  path: '/phone',
  component: Layout,
  alwaysShow: true,
  name: 'VuePhone',
  meta: { title: '基础设置', icon: 'peoples' },
  children: [
    {
      path: '/onlineImages',
      name: 'VueOnlineImages',
      component: () => import('@/views/phone/onlineImages'),
      meta: {
        title: '图片管理',
        noCache: true
        // perms: ['POST /api/v1/branch/list', 'GET /api/v1/branch/del', 'POST /api/v1/branch/add', 'POST /api/v1/branch/edit', 'POST /api/v1/auth_rule/all']
      }
    },
    {
      path: '/onlineServices',
      name: 'VueOnlineServices',
      component: () => import('@/views/phone/onlineServices'),
      meta: {
        title: '服务管理',
        noCache: true
        // perms: ['POST /api/v1/branch/list', 'GET /api/v1/branch/del', 'POST /api/v1/branch/add', 'POST /api/v1/branch/edit', 'POST /api/v1/auth_rule/all']
      }
    },
    {
      path: '/onlineShopType',
      name: 'VueOnlineShopType',
      component: () => import('@/views/phone/onlineShoptype'),
      meta: {
        title: '服务分类',
        noCache: true
        // perms: ['POST /api/v1/manager/list', 'POST /api/v1/manager/add', 'POST /api/v1/manager/edit']
      }
    }
    ,
    {
      path: '/orderManagement',
      name: 'VueOrderManagement',
      component: () => import('@/views/phone/orderManagement'),
      meta: {
        title: '订单管理',
        noCache: true
        // perms: ['POST /api/v1/manager/list', 'POST /api/v1/manager/add', 'POST /api/v1/manager/edit']
      }
    }
    // {
    //   path: '/test1',
    //   name: 'VueOnlineShopType1',
    //   component: () => import('@/views/phone/test'),
    //   meta: {
    //     title: '测试',
    //     noCache: true
    //     // perms: ['POST /api/v1/manager/list', 'POST /api/v1/manager/add', 'POST /api/v1/manager/edit']
    //   }
    // },
    // {
    //   path: '/test2',
    //   name: 'VueOnlineShopType2',
    //   component: () => import('@/views/phone/testbak'),
    //   meta: {
    //     title: '测试',
    //     noCache: true
    //     // perms: ['POST /api/v1/manager/list', 'POST /api/v1/manager/add', 'POST /api/v1/manager/edit']
    //   }
    // }
  ]
}
export default phoneRouter
