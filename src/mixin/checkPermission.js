import store from '@/store'
export default {
  methods: {
    checkPermission(key) {
      const userInfo = store.getters.userInfo
      if (userInfo.points && userInfo.points.length) {
        return userInfo.points.some(x => x === key) ? { display: '' } : { display: 'none' }
      }
      return { display: 'none' }
    },
    checkPermBool(key1, key2) {
      const userInfo = store.getters.userInfo
      if (userInfo.points && userInfo.points.length) {
        return userInfo.points.some(x => x === key1) || userInfo.points.some(x => x === key2)
      }
      return false
    }
  }
}
