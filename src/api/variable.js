import request from '@/utils/request'

export function getVariable(params) {
  // 返回promise对象
  return request({
    url: '/variable/',
    method: 'get',
    params
  })
}

export function updateVariable(data) {
  // 返回promise对象
  return request({
    url: `/variable/${data.id}/`,
    method: 'put',
    data
  })
}
