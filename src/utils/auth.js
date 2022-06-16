const TokenKey = 'auth'
const Expire = 'exp'

export function getToken() {
  return localStorage.getItem('auth')
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.clear()
}

export function getExpire() {
  return localStorage.removeItem(Expire)
}

export function setExpire() {
  return localStorage.setItem(Expire, Date.now())
}

export function setUserInfo(res) {
  localStorage.setItem('id', res.id)
  localStorage.setItem('username', res.username)
  localStorage.setItem('name', res.first_name)
  localStorage.setItem('region', res.region)
  localStorage.setItem('group', res.group)
  localStorage.setItem('menus', res.perms.menus)
  localStorage.setItem('points', res.perms.points)
}

export function getUserInfo() {
  return {
    id: localStorage.getItem('id'),
    username: localStorage.getItem('username'),
    name: localStorage.getItem('name'),
    region: localStorage.getItem('region'),
    group: localStorage.getItem('group'),
    menus: localStorage.getItem('menus'),
    points: localStorage.getItem('points')
  }
}

