import Vue from 'vue'
import Router from 'vue-router'
// 引入modules中子路由
import apsaRouter from './modules/apsa'
import bulkRouter from './modules/bulk'
import userRouter from './modules/user'
import permissionRouter from './modules/permission'
import dailyRouter from './modules/daily'
import fillingRouter from './modules/filling'
import malfunctionRouter from './modules/malfunction'
import settingRouter from './modules/setting'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

// 定义动态路由变量
export const asyncRouter = [
  fillingRouter, dailyRouter, malfunctionRouter, apsaRouter, bulkRouter, userRouter, permissionRouter, settingRouter
]

// 静态路由（无需权限）
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: [...constantRoutes, ...asyncRouter] // 动静态路由临时拼接
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
