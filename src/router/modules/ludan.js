import Layout from '@/layout'
export default {
  path: '/ludan/',
  name: 'ludan',
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [{
    path: '',
    component: () => import('@/views/ludan'),
    meta: {
      title: '路单登记',
      icon: 'chart'
    }
  }]
}
