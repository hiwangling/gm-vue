/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const mallRouter = {
  path: '/mall',
  component: Layout,
  alwaysShow: true,
  name: 'VueSetting',
  meta: { title: '商城管理', icon: 'component' },
  children: [
    {
      path: '/slider',
      name: 'slider',
      component: () => import('@/views/mall/slider'),
      meta: {
        title: '轮播管理',
        noCache: true,
        perms: ['POST /api/v1/branch/list', 'GET /api/v1/branch/del', 'POST /api/v1/branch/add', 'POST /api/v1/branch/edit', 'POST /api/v1/auth_rule/all']
      }
    },
    {
      path: '/goods',
      name: 'goods',
      component: () => import('@/views/mall/goods'),
      meta: {
        title: '商品管理',
        noCache: true,
        perms: ['POST /api/v1/branch/list', 'GET /api/v1/branch/del', 'POST /api/v1/branch/add', 'POST /api/v1/branch/edit', 'POST /api/v1/auth_rule/all']
      }
    },
    {
      path: '/goodsType',
      name: 'goodsType',
      component: () => import('@/views/mall/goodsType'),
      meta: {
        title: '商品分类',
        noCache: true,
        perms: ['POST /api/v1/branch/list', 'GET /api/v1/branch/del', 'POST /api/v1/branch/add', 'POST /api/v1/branch/edit', 'POST /api/v1/auth_rule/all']
      }
    },
    {
      path: '/order-mall',
      name: 'order-mal',
      component: () => import('@/views/mall/order'),
      meta: {
        title: '订单管理',
        noCache: true,
        perms: ['POST /api/v1/branch/list', 'GET /api/v1/branch/del', 'POST /api/v1/branch/add', 'POST /api/v1/branch/edit', 'POST /api/v1/auth_rule/all']
      }
    },
    {
      path: '/memorial',
      name: 'memorial',
      component: () => import('@/views/mall/memorial'),
      meta: {
        title: '纪念馆列表',
        noCache: true,
        perms: ['POST /api/v1/branch/list', 'GET /api/v1/branch/del', 'POST /api/v1/branch/add', 'POST /api/v1/branch/edit', 'POST /api/v1/auth_rule/all']
      }
    },
    {
      path: '/member-mall',
      name: 'member-mall',
      component: () => import('@/views/mall/member'),
      meta: {
        title: '会员列表',
        noCache: true,
        perms: ['POST /api/v1/branch/list', 'GET /api/v1/branch/del', 'POST /api/v1/branch/add', 'POST /api/v1/branch/edit', 'POST /api/v1/auth_rule/all']
      }
    }
  ]
}
export default mallRouter
