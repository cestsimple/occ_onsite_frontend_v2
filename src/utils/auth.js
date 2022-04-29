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
  localStorage.setItem('username', res.username)
  localStorage.setItem('level', res.level)
  localStorage.setItem('region', res.region)
  localStorage.setItem('group', res.group)
}

export function getUserInfo() {
  return {
    username: localStorage.getItem('username'),
    level: localStorage.getItem('level'),
    region: localStorage.getItem('region'),
    group: localStorage.getItem('group')
  }
}

