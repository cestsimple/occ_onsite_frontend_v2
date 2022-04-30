import Layout from '@/layout'
export default {
  path: '/malfunction/',
  name: 'malfunction',
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [{
    path: '',
    component: () => import('@/views/malfunction'),
    meta: {
      title: '停机报表',
      icon: 'chart'
    }
  }]
}
