import Layout from '@/layout'
export default {
  path: '/asset/',
  name: 'asset',
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [{
    path: '',
    component: () => import('@/views/asset'),
    meta: {
      title: '资产管理',
      icon: 'component'
    }
  }, {
    path: 'invoice',
    hidden: true,
    component: () => import('@/views/asset/invoice-variable'),
    meta: {
      title: '产气设备开票变量管理',
      icon: 'component'
    }
  }
  ]
}
