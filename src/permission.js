import Vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/404']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (Vue.ls.get(ACCESS_TOKEN)) {
    if (to.path === '/login') {
      next()
      NProgress.done()
    } else {
      if (store.getters.menuList.length === 0) {
        store
          .dispatch('GetMenuList')
          .then(data => {
            router.addRoutes(data)
            next({ path: to.fullPath })
          })
          .catch(() => {
            store.dispatch('Logout')
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next({ path: '/login' })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
