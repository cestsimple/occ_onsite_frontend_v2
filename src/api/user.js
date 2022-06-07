import request from '@/utils/request'

export function login(data) {
  // 返回promise对象
  return request({
    url: '/user/auth/',
    method: 'post',
    data
  })
}

export function setPassword(data) {
  // 返回promise对象
  return request({
    url: '/user/password/',
    method: 'put',
    data
  })
}

export function getUser(params) {
  // 返回promise对象
  return request({
    url: '/user/',
    method: 'get',
    params
  })
}

export function getUserById(id) {
  // 返回promise对象
  return request({
    url: `/user/${id}/`,
    method: 'get'
  })
}

export function updateUser(data) {
  // 返回promise对象
  return request({
    url: `/user/${data.id}/`,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  // 返回promise对象
  return request({
    url: `/user/${id}/`,
    method: 'delete'
  })
}

export function createUser(data) {
  // 返回promise对象
  return request({
    url: '/user/',
    method: 'post',
    data
  })
}

export function getRole() {
  // 返回promise对象
  return request({
    url: '/user/role',
    method: 'get'
  })
}

export function deleteRole(id) {
  // 返回promise对象
  return request({
    url: `/user/role/${id}/`,
    method: 'delete'
  })
}

export function createRole(data) {
  // 返回promise对象
  return request({
    url: '/user/role/',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  // 返回promise对象
  return request({
    url: `/user/role/${data.id}/`,
    method: 'put',
    data
  })
}

export function assignRole(data) {
  return request({
    url: '/user/assignRole/',
    data,
    method: 'put'
  })
}

export function getPermissionList() {
  // 返回promise对象
  return request({
    url: '/user/permission/',
    method: 'get'
  })
}

export function updatePermission(data) {
  // 返回promise对象
  return request({
    url: `/user/permission/${data.id}/`,
    method: 'put',
    data
  })
}

export function createPermission(data) {
  // 返回promise对象
  return request({
    url: '/user/permission/',
    method: 'post',
    data
  })
}

export function deletePermission(id) {
  // 返回promise对象
  return request({
    url: `/user/permission/${id}/`,
    method: 'delete'
  })
}

export function assignPerm(data) {
  return request({
    url: '/user/role/assignPrem/',
    method: 'put',
    data
  })
}

export function getRoleDetail(id) {
  // 返回promise对象
  return request({
    url: `/user/role/${id}/`,
    method: 'get'
  })
}
