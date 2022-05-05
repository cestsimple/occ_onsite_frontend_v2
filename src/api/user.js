import request from '@/utils/request'

export function login(data) {
  // 返回promise对象
  return request({
    url: '/user/auth/',
    method: 'post',
    data
  })
}

export function getUser(params) {
  // 返回promise对象
  return request({
    url: '/user/',
    method: 'get',
    params
  })
}
