import request from '@/utils/request'

export function getDaily(params) {
  // 返回promise对象
  return request({
    url: '/daily/',
    method: 'get',
    params
  })
}

export function getModify(pk) {
  // 返回promise对象
  return request({
    url: `/daily/mod/${pk}/`,
    method: 'get'
  })
}

export function getOrigin(pk) {
  // 返回promise对象
  return request({
    url: `/daily/origin/${pk}/`,
    method: 'get'
  })
}

export function getLintotDetail(pk) {
  // 返回promise对象
  return request({
    url: `/daily/lintot/${pk}/`,
    method: 'get'
  })
}

export function updateModify(data) {
  // 返回promise对象
  return request({
    url: `/daily/mod/${data.id}/`,
    method: 'put',
    data
  })
}

export function updateDaily(data) {
  // 返回promise对象
  return request({
    url: `/daily/${data.id}/`,
    method: 'put',
    data
  })
}

export function addRecord(data) {
  return request({
    url: '/iot/record/add/',
    method: 'post',
    data
  })
}
