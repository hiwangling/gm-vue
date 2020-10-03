/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const statsRouter = {
  path: '/stats',
  component: Layout,
  alwaysShow: true,
  name: 'vueStats',
  meta: { title: '统计管理', icon: 'nested' },
  children: [
    {
      path: '/grave-list',
      name: 'VuegraveList',
      component: () => import('@/views/stats/grave-list'),
      meta: {
        title: '墓穴统计',
        noCache: true,
        perms: ['GET /api/v1/stat/buy_order_list', 'GET /api/v1/stat/export_order_stat']
      }
    },
    {
      path: '/move-list',
      name: 'VueMoveList',
      component: () => import('@/views/stats/move-list'),
      meta: {
        title: '迁出统计',
        noCache: true,
        perms: ['GET /api/v1/stat/buy_order_list', 'GET /api/v1/stat/export_order_stat']
      }
    },

    {
      path: '/return-list',
      name: 'VuereturnList',
      component: () => import('@/views/stats/return-list'),
      meta: {
        title: '退墓统计',
        noCache: true,
        perms: ['GET /api/v1/stat/buy_order_list', 'GET /api/v1/stat/export_order_stat']
      }
    },

    {
      path: '/service-list',
      name: 'VueServiceList',
      component: () => import('@/views/stats/service-list'),
      meta: {
        title: '服务统计',
        noCache: true,
        perms: ['GET /api/v1/stat/buy_services_list', 'GET /api/v1/stat/export_services_stat']
      }
    },
    // {
    //   path: '/lamp-list',
    //   name: 'VueLampList',
    //   component: () => import('@/views/stats/lamp-list'),
    //   meta: {
    //     title: '点灯统计',
    //     noCache: true,
    //     perms: ['GET /api/v1/stat/buy_lightup_list', 'GET /api/v1/stat/export_lightup_stat']
    //   }
    // },
    {
      path: 'bury-list',
      name: 'VueBuryList',
      component: () => import('@/views/stats/bury-list'),
      meta: {
        title: '安葬统计',
        noCache: true,
        perms: ['GET /api/v1/stat/az_bury_list', 'GET /api/v1/stat/export_bury_stat']
      }
    },
    {
      path: '/swap-list',
      name: 'VueswapList',
      component: () => import('@/views/stats/swap-list'),
      meta: {
        title: '换墓记录',
        noCache: true,
        perms: ['GET /api/v1/stat/buy_order_list', 'GET /api/v1/stat/export_order_stat']
      }
    },
    {
      path: '/cemetery-list',
      name: 'VueCemeteryList',
      component: () => import('@/views/stats/cemetery-list'),
      meta: {
        title: '购墓记录',
        noCache: true,
        perms: ['GET /api/v1/stat/buy_order_list', 'GET /api/v1/stat/export_order_stat']
      }
    },
    {
      path: '/savelist',
      name: 'saveList',
      component: () => import('@/views/stats/save-list'),
      meta: {
        title: '寄存取走记录',
        noCache: true,
        perms: ['GET /api/v1/stat/buy_order_list', 'GET /api/v1/stat/export_order_stat']
      }
    },
    {
      path: '/sell-list',
      name: 'VuesellList',
      component: () => import('@/views/stats/sell-list'),
      meta: {
        title: '今日销售统计',
        noCache: true,
        perms: ['GET /api/v1/stat/buy_order_list', 'GET /api/v1/stat/export_order_stat']
      }
    }

  ]
}
export default statsRouter
