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
  }, {
    path: 'role',
    hidden: true,
    component: () => import('@/views/users/role-info'),
    meta: {
      title: '角色管理',
      icon: 'people'
    }
  }]
}
