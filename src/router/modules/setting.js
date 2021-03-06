/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const settingRouter = {
  path: '/setting',
  component: Layout,
  alwaysShow: true,
  name: 'VueSetting',
  meta: { title: '系统设置', icon: 'peoples' },
  children: [
    {
      path: '/group',
      name: 'Vuegroup',
      component: () => import('@/views/setting/group'),
      meta: {
        title: '部门管理',
        noCache: true
        // perms: ['POST /api/v1/branch/list', 'GET /api/v1/branch/del', 'POST /api/v1/branch/add', 'POST /api/v1/branch/edit', 'POST /api/v1/auth_rule/all']
      }
    },
    {
      path: '/role',
      name: 'VueRole',
      component: () => import('@/views/setting/role'),
      meta: {
        title: '角色管理',
        noCache: true,
        perms: ['POST /api/v1/branch/list', 'GET /api/v1/branch/del', 'POST /api/v1/branch/add', 'POST /api/v1/branch/edit', 'POST /api/v1/auth_rule/all']
      }
    },
    {
      path: '/employee',
      name: 'VueEmployee',
      component: () => import('@/views/setting/employee'),
      meta: {
        title: '员工管理',
        noCache: true,
        perms: ['POST /api/v1/manager/list', 'POST /api/v1/manager/add', 'POST /api/v1/manager/edit']
      }
    },
    {
      path: '/password',
      name: 'ChangePassword',
      component: () => import('@/views/setting/password'),
      meta: {
        title: '修改密码',
        noCache: true
      }
    },
    {
      path: '/configuration',
      name: 'VueConfiguration',
      component: () => import('@/views/setting/configuration'),
      meta: {
        title: '系统配置',
        noCache: true
      }
    }
  ]
}
export default settingRouter
