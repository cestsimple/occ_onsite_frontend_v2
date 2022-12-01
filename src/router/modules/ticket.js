import Layout from '@/layout'
export default {
  path: '/ticket/',
  name: 'ticket',
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [{
    path: '',
    component: () => import('@/views/ticket'),
    meta: {
      title: '项目任务管理',
      icon: 'project'
    }
  }]
}
