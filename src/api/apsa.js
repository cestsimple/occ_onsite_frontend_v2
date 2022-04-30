import request from '@/utils/request'

export function getApsa(params) {
  // 返回promise对象
  return request({
    url: '/apsa/',
    method: 'get',
    params
  })
}
