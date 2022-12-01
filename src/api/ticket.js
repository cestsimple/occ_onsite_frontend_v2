import request from '@/utils/request'

export function getTaskList(params) {
  // 获取task列表
  return request({
    url: '/ticket/tasks/',
    method: 'get',
    params
  })
}

export function getTask(id) {
  // 获取task列表
  return request({
    url: `/ticket/task/${id}/`,
    method: 'get'
  })
}

export function createTask(data) {
  // 创建task
  return request({
    url: '/ticket/tasks/',
    method: 'post',
    data
  })
}

export function updateTask(data) {
  // 更新task
  return request({
    url: `/ticket/task/${data.id}/`,
    method: 'put',
    data
  })
}

export function getProjectList(params) {
  // 获取project列表
  return request({
    url: '/ticket/projects/',
    method: 'get',
    params
  })
}

export function getProject(id) {
  // 获取project列表
  return request({
    url: `/ticket/project/${id}/`,
    method: 'get'
  })
}

export function createProject(data) {
  // 创建project
  return request({
    url: '/ticket/projects/',
    method: 'post',
    data
  })
}

export function updateProject(data) {
  // 更新project
  return request({
    url: `/ticket/project/${data.id}/`,
    method: 'put',
    data
  })
}

export function getNodeList(params) {
  // 获取node列表
  return request({
    url: '/ticket/nodes/',
    method: 'get',
    params
  })
}

export function getNode(id) {
  // 获取node列表
  return request({
    url: `/ticket/node/${id}/`,
    method: 'get'
  })
}

export function createNode(data) {
  // 创建node
  return request({
    url: '/ticket/nodes/',
    method: 'post',
    data
  })
}

export function updateNode(data) {
  // 更新node
  return request({
    url: `/ticket/node/${data.id}/`,
    method: 'put',
    data
  })
}

export function getNodeContentList(params) {
  // 获取node content列表
  return request({
    url: '/ticket/node/contents/',
    method: 'get',
    params
  })
}

export function getNodeContent(id) {
  // 获取node content列表
  return request({
    url: `/ticket/node/content/${id}/`,
    method: 'get'
  })
}

export function createNodeContent(data) {
  // 创建node content
  return request({
    url: '/ticket/node/contents/',
    method: 'post',
    data
  })
}

export function updateNodeContent(data) {
  // 更新node content
  return request({
    url: `/ticket/node/content/${data.id}/`,
    method: 'put',
    data
  })
}

export function getTaskMyTodo(params) {
  // 获取node content列表
  return request({
    url: `/ticket/task/mytodo/`,
    method: 'get',
    params
  })
}
