import request from '@/utils/request'

export function getBulk(params) {
  // 返回promise对象
  return request({
    url: '/bulk/',
    method: 'get',
    params
  })
}
