import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/basic-info',
      name: 'basic-info',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/basic-info/BasicView.vue'),
      children: [
        {
          path: 'customer',
          name: '客戶資料維護',
          component: () => import('@/views/basic-info/CustomerView.vue'),
          meta: {
            title: '客戶資料維護',
            breadcrumb: '客戶資料維護',
            isSpecialPage: true
          },
        },
        {
          path: 'contact',
          name: '聯絡人資料維護',
          component: () => import('@/views/basic-info/ContactView.vue'),
          meta: {
            title: '聯絡人資料',
            breadcrumb: '聯絡人資料',
            isSpecialPage: true
          }
        },
        {
          path: 'bill',
          name: '帳單資料維護',
          component: () => import('@/views/basic-info/BillView.vue'),
          meta: {
            title: '帳單資料',
            breadcrumb: '帳單資料',
            isSpecialPage: true
          }
        },
        {
          path: 'vehicle',
          name: '車籍資料維護',
          component: () => import('@/views/basic-info/VehicleView.vue'),
          meta: {
            title: '車籍資料',
            breadcrumb: '車籍資料',
            isSpecialPage: true
          }
        },
        {
          path: 'communication-records',
          name: '通訊記錄維護',
          component: () => import('@/views/basic-info/CommunicationrecordsView.vue'),
          meta: {
            title: '通訊記錄',
            breadcrumb: '通訊記錄',
            isSpecialPage: true
          }
        },
        {
          path: 'salesperson',
          name: '業務員資料維護',
          component: () => import('@/views/basic-info/SalespersonView.vue'),
          meta: {
            title: '業務員資料',
            breadcrumb: '業務員資料',
            isSpecialPage: true
          }
        },
        {
          path: 'supplier',
          name: '供應商資料維護',
          component: () => import('@/views/basic-info/SupplierView.vue'),
          meta: {
            title: '供應商資料',
            breadcrumb: '供應商資料',
            isSpecialPage: true
          }
        },
        {
          path: 'discount',
          name: '客戶折讓資料',
          component: () => import('@/views/basic-info/Discount.vue'),
          meta: {
            title: '客戶折讓資料',
            breadcrumb: '客戶折讓資料',
            isSpecialPage: true
          }
        },
        {
          path: 'FinanceManagement',
          name: '帳務管理',
          component: () => import('@/views/basic-info/FinanceManagement.vue'),
          meta: {
            title: '帳務管理',
            breadcrumb: '帳務管理',
            isSpecialPage: false
          }
        },
        {
          path: 'SalesControl',
          name: '銷售管理',
          component: () => import('@/views/basic-info/SalesControl.vue'),
          meta: {
            title: '銷售管理',
            breadcrumb: '銷售管理',
            isSpecialPage: false
          }
        },
        {
          path: 'ReportManagement',
          name: '報表',
          component: () => import('@/views/basic-info/ReportManagement.vue'),
          meta: {
            title: '報表',
            breadcrumb: '報表',
            isSpecialPage: false
          }
        },
        {
          path: 'AccessControl',
          name: '權限管理',
          component: () => import('@/views/basic-info/AccessControl.vue'),
          meta: {
            title: '供應權限管理商資料',
            breadcrumb: '供應權限管理商資料',
            isSpecialPage: false
          }
        },
        {
          path: 'SelectView',
          name: '客戶資料查詢',
          component: () => import('@/views/basic-info/SelectView.vue'),
          meta: {
            title: '客戶資料查詢',
            breadcrumb: '客戶資料查詢',
          },
          props: route => ({
            customerName: route.query.customerName,
          }),
        }
      ]
    }
  ]
})

export default router
