import request from '@/utils/request'

export function getJobs(params) {
  // 返回promise对象
  return request({
    url: '/asyncjob/',
    method: 'get',
    params
  })
}
