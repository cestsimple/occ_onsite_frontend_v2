import Layout from '@/layout'
export default {
  path: '/permission/',
  name: 'permission',
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [{
    path: '',
    component: () => import('@/views/permission'),
    meta: {
      title: '权限管理',
      icon: 'lock'
    }
  }]
}
