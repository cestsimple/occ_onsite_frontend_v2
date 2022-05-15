import SearchBar from './SearchBar/index.vue'
import FilterBar from './SearchBar/simple.vue'
import TagsView from './TagsView'
export default {
  install(Vue) {
    // 组件注册
    Vue.component('SearchBar', SearchBar)
    Vue.component('FilterBar', FilterBar)
    Vue.component('TagsView', TagsView)
  }
}
