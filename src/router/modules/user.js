import Layout from '@/layout'
export default {
  path: '/users/',
  name: 'users',
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [{
    path: '',
    component: () => import('@/views/users'),
    meta: {
      title: '用户管理',
      icon: 'people'
    }
  }]
}
