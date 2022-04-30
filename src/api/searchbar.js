import request from '@/utils/request'

export function getEngineer(region) {
  // 返回promise对象
  return request({
    url: '/user/?engineer=1&region=' + region,
    method: 'get'
  })
}
