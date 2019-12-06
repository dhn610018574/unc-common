import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { VueAxios } from './axios'
import { Modal, notification } from 'ant-design-vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

notification.config({
  top: '62px'
})

// 创建 axios 实例
const service = axios.create({
  timeout: 30000 // 请求超时时间
})

const err = error => {
  if (error.response) {
    let data = error.response.data

    switch (error.response.status) {
      case 403:
        notification.error({ message: '系统提示', description: '拒绝访问', duration: 4 })
        break
      case 404:
        notification.error({ message: '系统提示', description: '很抱歉，资源未找到!', duration: 4 })
        break
      case 426:
        notification.error({ message: '系统提示', description: '用户名或密码错误', duration: 4 })
        break
      case 504:
        notification.error({ message: '系统提示', description: '网络超时' })
        break
      case 401:
        const token = Vue.ls.get(ACCESS_TOKEN)
        if (token) {
          Modal.error({
            title: '登录已过期',
            content: '很抱歉，登录已过期，请重新登录',
            okText: '重新登录',
            mask: false,
            onOk: () => {
              store.dispatch('Logout')
            }
          })
        }
        break
      case 500:
        notification.error({ message: '系统提示', description: '服务器异常' })
        break
      default:
        notification.error({
          message: '系统提示',
          description: data.msg || data.message,
          duration: 4
        })
        break
    }
  } else {
    // 服务端无返回
    if (!window.navigator.onLine) {
      // 客户端断网处理
    } else {
      notification.error({ message: '系统提示', description: '服务端异常，请稍后重试', duration: 4 })
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(
  config => {
    const token = Vue.ls.get(ACCESS_TOKEN)

    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token // token
    }
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.parse(new Date()) / 1000
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(response => {
  return response.data
}, err)

const installer = {
  vm: {},
  install(Vue, router = {}) {
    Vue.use(VueAxios, router, service)
  }
}

export { installer as VueAxios, service as axios }
