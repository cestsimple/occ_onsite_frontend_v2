import request from '@/utils/request'

export function getRecord() {
  // 返回promise对象
  return request({
    url: '/iot/record/',
    method: 'get'
  })
}

export function calculateFilling() {
  // 返回promise对象
  return request({
    url: '/filling/calculate/',
    method: 'get'
  })
}

export function calculateDaily() {
  // 返回promise对象
  return request({
    url: '/daily/calculate/',
    method: 'get'
  })
}

export function calculateFillingMonthly(params) {
  // 返回promise对象
  return request({
    url: '/filling/monthly/calculate/',
    method: 'get',
    params
  })
}

export function calculateInvoiceDiff(params) {
  // 返回promise对象
  return request({
    url: '/monthly/invoice/calculate/',
    method: 'get',
    params
  })
}
