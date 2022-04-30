import Layout from '@/layout'
export default {
  path: '/daily/',
  name: 'daily',
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [{
    path: '',
    component: () => import('@/views/daily'),
    meta: {
      title: '每日报表',
      icon: 'chart'
    }
  }]
}
