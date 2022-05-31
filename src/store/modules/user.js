import { getToken, setToken, removeToken, getUserInfo, setUserInfo, setExpire } from '@/utils/auth'
import { Message } from 'element-ui'
import { getUserById, login } from '@/api/user'
import { asyncRoutes, constantRoutes, resetRouter } from '@/router'
// 状态
const state = {
  token: getToken(),
  userInfo: getUserInfo(),
  routes: []
}
// 修改状态
const mutations = {
  setToken(state, token) {
    state.token = token
    // 同步给localstorage
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  setUserInfo(state, res) {
    state.userInfo.id = res.id
    state.userInfo.username = res.username
    state.userInfo.region = res.region
    state.userInfo.group = res.group
    state.userInfo.menus = res.perms.menus
    state.userInfo.points = res.perms.points
    // 同步给localstorage
    setUserInfo(res)
  },
  removeUserInfo(state) {
    state.userInfo = {
      id: null,
      username: '',
      region: '',
      group: '',
      menus: [],
      points: []
    }
  },
  // 用户路由权限
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
// 执行异步
const actions = {
  // 登录
  async login(context, data) {
    let res = await login(data).catch(error => {
      console.log(error)
      Message.error('登陆失败' + error)
    })
    context.commit('setToken', res.token)
    res = await getUserById(res.id)
    context.commit('setUserInfo', res)
    // 添加路由
    const routes = []
    res.perms.menus.forEach(key => {
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    context.commit('setRoutes', routes)
    setExpire()
  },
  // 登出
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
    // 重置路由
    resetRouter()
    context.commit('setRoutes', [])
  },
  async filterRoutes(context, id) {
    const res = await getUserById(id)
    context.commit('setUserInfo', res)
    // 添加路由
    const routes = []
    res.perms.menus.forEach(key => {
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    context.commit('setRoutes', routes)
    return routes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
