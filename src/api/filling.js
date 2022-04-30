import request from '@/utils/request'

export function getFilling(params) {
  // 返回promise对象
  return request({
    url: '/filling/',
    method: 'get',
    params
  })
}

export function deleteFilling(pk) {
  // 返回promise对象
  return request({
    url: '/filling/' + pk + '/',
    method: 'delete'
  })
}

export function confirmFilling(item) {
  // 返回promise对象
  item.confirm = 1
  return request({
    url: '/filling/' + item.id + '/',
    method: 'put',
    data: item
  })
}

export function addFilling(data) {
  // 返回promise对象
  return request({
    url: '/filling/',
    method: 'post',
    data
  })
}

export function updateFilling(data) {
  // 返回promise对象
  return request({
    url: `/filling/${data.id}/`,
    method: 'put',
    data
  })
}
