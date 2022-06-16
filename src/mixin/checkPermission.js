import store from '@/store'
export default {
  methods: {
    checkPermission(key) {
      const userInfo = store.getters.userInfo
      if (userInfo.points && userInfo.points.length) {
        return userInfo.points.some(x => x === key)
      }
      return false
    }
  }
}
