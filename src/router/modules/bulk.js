import Layout from '@/layout'
export default {
  path: '/bulk/',
  name: 'bulk',
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [{
    path: '',
    component: () => import('@/views/bulk'),
    meta: {
      title: '储罐管理',
      icon: 'component'
    }
  }]
}
