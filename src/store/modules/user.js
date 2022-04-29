import { getToken, setToken, removeToken, getUserInfo, setUserInfo, setExpire } from '@/utils/auth'
import { Message } from 'element-ui'
import { login } from '@/api/user'
// 状态
const state = {
  token: getToken(),
  userInfo: getUserInfo()
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
    state.userInfo.username = res.username
    state.userInfo.level = res.level
    state.userInfo.region = res.region
    state.userInfo.group = res.group
    // 同步给localstorage
    setUserInfo(res)
  },
  removeUserInfo(state) {
    state.userInfo = {
      username: '',
      level: 0,
      region: '',
      group: ''
    }
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    // 调用api接口
    const res = await login(data).catch(error => {
      console.log(error)
      Message.error('登陆失败' + error)
    })
    console.log(res)
    context.commit('setToken', res.token)
    context.commit('setUserInfo', res)
    setExpire()
  },
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户信息
    context.commit('removeUserInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
