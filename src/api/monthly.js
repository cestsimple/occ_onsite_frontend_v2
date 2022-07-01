import request from '@/utils/request'

export function getMontlyMalfunction(params) {
  // 返回promise对象
  return request({
    url: '/monthly/malfunction/',
    method: 'get',
    params
  })
}
