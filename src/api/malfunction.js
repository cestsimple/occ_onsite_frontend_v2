import request from '@/utils/request'

export function getMalfunction(params) {
  // 返回promise对象
  return request({
    url: '/malfunction/',
    method: 'get',
    params
  })
}

export function deleteMalfunction(pk) {
  // 返回promise对象
  return request({
    url: '/malfunction/' + pk + '/',
    method: 'delete'
  })
}

export function addMalfunction(data) {
  // 返回promise对象
  return request({
    url: '/malfunction/',
    method: 'post',
    data
  })
}

export function updateMalfunction(data) {
  // 返回promise对象
  return request({
    url: `/malfunction/${data.id}/`,
    method: 'put',
    data
  })
}

export function getReason(params) {
  // 返回promise对象
  return request({
    url: `/malfunction/reason/`,
    method: 'get',
    params
  })
}

export function getReasonDetail(params) {
  // 返回promise对象
  return request({
    url: `/malfunction/reason/detail/`,
    method: 'get',
    params
  })
}
