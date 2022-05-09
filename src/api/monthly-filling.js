import request from '@/utils/request'

export function getFilling(params) {
  // 返回promise对象
  return request({
    url: '/monthly/filling/',
    method: 'get',
    params
  })
}

export function updateFilling(data) {
  // 返回promise对象
  return request({
    url: `/monthly/filling/${data.id}/`,
    method: 'put',
    data
  })
}
