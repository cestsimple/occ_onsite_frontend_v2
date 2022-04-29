import router from './router'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login/', '/404/'] // 定义白名单  所有不受权限控制的页面

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // 判断是否有token
  if (store.getters.token) {
    // 有token
    if (to.path === '/login/') {
      next('/')
    } else {
      next()
    }
  } else {
    // 没有token, 判断白名单
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login/')
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
