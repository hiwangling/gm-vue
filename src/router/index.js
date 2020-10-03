import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'
import cemeteryRouter from './modules/cemetery'
import settingRouter from './modules/setting'
import serviceRouter from './modules/service'
import manageRouter from './modules/manage'
import orderRouter from './modules/order'
import statsRouter from './modules/stats'
import phoneRouter from './modules/phone'
import mallRouter from './modules/mall'
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/redirect/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/redirect/401'),
    hidden: true
  },
  {
    path: '/dp',
    component: () => import('@/views/dp/index')
  },
  {
    path: '/dp/mxzs',
    component: () => import('@/views/dp/mxzs')
  },
  {
    path: '/dp/show',
    component: () => import('@/views/dp/show')
  },
  {
    path: '/dp/info',
    component: () => import('@/views/dp/info')
  },
  {
    path: '/dp/search',
    component: () => import('@/views/dp/search')
  },
  {
    path: '/dp/cemetery',
    component: () => import('@/views/dp/cemetery')
  },
  {
    path: '/dp/detail',
    component: () => import('@/views/dp/detail')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]

export const asyncRoutes = [
  manageRouter,
  orderRouter,
  statsRouter,
  cemeteryRouter,
  serviceRouter,
  settingRouter,
  phoneRouter,
  mallRouter,
  { path: '*', redirect: '/404', hidden: true }

]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
