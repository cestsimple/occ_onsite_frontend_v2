import Layout from '@/layout'
export default {
  path: '/daily/detail/',
  name: 'daily',
  hidden: true,
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [{
    path: '',
    component: () => import('@/views/daily/daily_detail'),
    meta: {
      title: '每日报表',
      icon: 'chart'
    }
  }]
}
