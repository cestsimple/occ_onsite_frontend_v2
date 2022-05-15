import request from '@/utils/request'

export function getInvoiceDiff(params) {
  // 返回promise对象
  return request({
    url: '/monthly/variable/diff/',
    method: 'get',
    params
  })
}

export function updateInvoiceDiff(data) {
  // 返回promise对象
  return request({
    url: `/monthly/variable/diff/${data.id}/`,
    method: 'put',
    data
  })
}

export function getInvoiceVariable(params) {
  // 返回promise对象
  return request({
    url: '/monthly/variable/',
    method: 'get',
    params
  })
}

export function deleteInvoiceVariable(id) {
  // 返回promise对象
  return request({
    url: `/monthly/variable/${id}/`,
    method: 'delete'
  })
}

export function addInvoiceVariable(data) {
  // 返回promise对象
  return request({
    url: `/monthly/variable/`,
    method: 'post',
    data
  })
}
