import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd, { DatePicker, message } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
// 浏览器样式重置
import '@/assets/styles/normalize.css'
import '@/assets/styles/reset.less'
import '@/utils/filter'
import { VueAxios } from '@/utils/request'
import Storage from 'vue-ls'
import '@/permission'

import api from '@/api'

DatePicker.props.getCalendarContainer.default = child => child.parentNode
DatePicker.MonthPicker.props.getCalendarContainer.default = child => child.parentNode
DatePicker.RangePicker.props.getCalendarContainer.default = child => child.parentNode
DatePicker.WeekPicker.props.getCalendarContainer.default = child => child.parentNode
message.config({
  maxCount: 1
})

Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.use(Antd)
Vue.use(Storage, {
  namespace: 'VC__',
  name: 'ls',
  storage: 'local'
})
Vue.use(VueAxios, router)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
