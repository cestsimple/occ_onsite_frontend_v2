import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})
service.interceptors.request.use() // 请求拦截器
service.interceptors.response.use() // 响应拦截器
export default service
