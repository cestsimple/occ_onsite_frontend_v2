import request from '@/utils/request'

export function getAsset(params) {
  // 返回promise对象
  return request({
    url: '/asset/',
    method: 'get',
    params
  })
}

export function updateAsset(data) {
  // 返回promise对象
  return request({
    url: `/asset/${data.id}/`,
    method: 'put',
    data
  })
}
