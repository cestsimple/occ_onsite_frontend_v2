import Layout from '@/layout'
export default {
  path: '/monthly/',
  name: 'monthly',
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [{
    path: '',
    component: () => import('@/views/monthly'),
    meta: {
      title: '月报表',
      icon: 'chart'
    }
  }]
}
