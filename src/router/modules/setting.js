import Layout from '@/layout'
export default {
  path: '/settings/',
  name: 'settings',
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [{
    path: '',
    component: () => import('@/views/setting'),
    meta: {
      title: '配置管理',
      icon: 'setting'
    }
  }]
}
