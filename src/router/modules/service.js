/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const serviceRouter = {
  path: '/service',
  component: Layout,
  name: 'VueService',
  alwaysShow: true,
  meta: { title: '基本配置', icon: 'list' },
  children: [
    {
      path: '/service-info',
      name: 'VueInfo',
      component: () => import('@/views/service/service-info'),
      meta: {
        title: '服务项目',
        noCache: true,
        perms: ['GET /api/v1/service_info/list', 'POST /api/v1/service_info/add', 'POST /api/v1/service_info/edit', 'GET /api/v1/service_info/del']
      }
    },
    {
      path: '/service-combo',
      name: 'VueCombo',
      component: () => import('@/views/service/service-combo'),
      meta: {
        title: '服务套餐',
        noCache: true,
        perms: ['GET /api/v1/combo/list', 'POST /api/v1/combo/add', 'POST /api/v1/combo/edit', 'GET /api/v1/combo/del']
      }
    }
    // {
    //   path: '/service-lamp',
    //   name: 'Vuelamp',
    //   component: () => import('@/views/service/service-lamp'),
    //   meta: {
    //     title: '点灯服务',
    //     noCache: true,
    //     perms: ['GET api/v1/service_info/list', 'POST /api/v1/service_info/add', 'POST /api/v1/service_info/edit', 'GET /api/v1/service_info/del']
    //   }
    // },
    // {
    //   path: '/service-plan',
    //   name: 'Vueplan',
    //   component: () => import('@/views/service/service-plan'),
    //   meta: {
    //     title: '点灯计划',
    //     noCache: true,
    //     perms: ['GET /api/v1/service_info/list', 'POST /api/v1/service_info/add', 'POST /api/v1/service_info/edit', 'GET /api/v1/service_info/del']
    //   }
    // }

  ]
}
export default serviceRouter
