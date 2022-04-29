import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import { getExpire } from './auth'
import router from '@/router'
const TimeOut = 3600 * 24 * 1// 定义jwt超时时间

// create an axios instance
const service = axios.create({
  timeout: 10000 // request timeout
})
service.defaults.baseURL = process.env.VUE_APP_BASE_API

service.interceptors.request.use(config => {
  if (store.getters.token) {
    // 检查超时
    if (IsTimeOut()) {
      store.dispatch('user/logout')
      router.push('/login/')
      return Promise.reject(new Error())
    }
    config.headers['Authorization'] = store.getters.token
  }
  return config
}, error => {
  return Promise.reject(error)
})

service.interceptors.response.use(response => {
  // axios默认加了一层data
  const data = response.data
  //   要根据success的成功与否决定下面的操作
  return data
}, error => {
  Message.error(error.msg) // 提示错误信息
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})

// 检查超时
function IsTimeOut() {
  var currentTime = Date.now()
  var exp = getExpire()
  return (currentTime - exp) / 1000 > TimeOut
}
export default service
