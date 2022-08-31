import request from '@/utils/request'

export function getJobs(params) {
  // 返回promise对象
  return request({
    url: '/asyncjob/',
    method: 'get',
    params
  })
}

export function deleteJob(id) {
  // 返回promise对象
  return request({
    url: `/asyncjob/${id}/`,
    method: 'delete'
  })
}

export function clearJob(params) {
  return request({
    url: '/asyncjob/clear/',
    method: 'get',
    params
  })
}
