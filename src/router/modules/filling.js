import Layout from '@/layout'
export default {
  path: '/filling/',
  name: 'filling',
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [{
    path: '',
    component: () => import('@/views/filling'),
    meta: {
      title: '充液报表',
      icon: 'chart'
    }
  }]
}
