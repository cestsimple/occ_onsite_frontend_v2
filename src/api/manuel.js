import request from '@/utils/request'

export function getRecord(params) {
  // 返回promise对象
  return request({
    url: '/iot/record/',
    method: 'get',
    params
  })
}

export function calculateFilling(params) {
  // 返回promise对象
  return request({
    url: '/filling/calculate/',
    method: 'get',
    params
  })
}

export function calculateDaily(params) {
  // 返回promise对象
  return request({
    url: '/daily/calculate/',
    method: 'get',
    params
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

export function getIotAll(params) {
  // 返回promise对象
  return request({
    url: '/iot/all/',
    method: 'get',
    params
  })
}

export function manuelCreateAsset(params) {
  return request({
    url: '/iot/asset/manuel/',
    method: 'get',
    params
  })
}
