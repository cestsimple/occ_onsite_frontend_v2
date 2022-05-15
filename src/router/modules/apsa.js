import Layout from '@/layout'
export default {
  path: '/apsa/',
  name: 'apsa',
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [{
    path: '',
    component: () => import('@/views/apsa'),
    meta: {
      title: '产气设备管理',
      icon: 'component'
    }
  }, {
    path: 'invoice',
    hidden: true,
    component: () => import('@/views/apsa/invoice-variable'),
    meta: {
      title: '产气设备开票变量管理',
      icon: 'component'
    }
  }
  ]
}
