import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AccessControl from '@/views/basic-info/AccessControl.vue'

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
          path: 'modifybill',
          name: '切換客代帳號',
          component: () => import('@/views/basic-info//Modifybill.vue'),
          meta: {
            title: '切換客代帳號',
            breadcrumb: '切換客代帳號',
            isSpecialPage:true
          },
        },
        {
          path: 'contact',
          name: '聯絡人資料維護',
          component: () => import('@/views/basic-info/ContactView.vue'),
          meta: {
            title: '聯絡人資料',
            breadcrumb: '聯絡人資料',
            isSpecialPage: false,
            isLinkPage: true
          }
        },
        {
          path: 'bill',
          name: '帳單資料維護',
          component: () => import('@/views/basic-info/BillView.vue'),
          meta: {
            title: '帳單資料',
            breadcrumb: '帳單資料',
            isSpecialPage: false,
            isLinkPage: true
          }
        },
        {
          path: 'vehicle',
          name: '車籍卡片資料維護',
          component: () => import('@/views/basic-info/VehicleView.vue'),
          meta: {
            title: '車籍卡片資料',
            breadcrumb: '車籍資卡片料',
            isVehiclePage: true
          }
        },
        {
          path: 'discountrecords',
          name: '更改客戶折讓',
          component: () => import('@/views/basic-info/discountrecords.vue'),
          meta: {
            title: '通訊記錄',
            breadcrumb: '通訊記錄',
            isSpecialPage: true
          }
        },
        {
          path: 'salesperson',
          name: '員工資料維護',
          component: () => import('@/views/basic-info/SalespersonView.vue'),
          meta: {
            title: '員工資料',
            breadcrumb: '員工資料',
            isSpecialPage: true
          }
        },
        {
          path: 'supplier',
          name: '結帳列印',
          component: () => import('@/views/basic-info/SupplierView.vue'),
          meta: {
            title: '結帳列印',
            breadcrumb: '結帳列印',
            isAccountsPage: true
          }
        },
        {
          path: 'discount',
          name: '客戶折讓資料',
          component: () => import('@/views/basic-info/Discount.vue'),
          meta: {
            title: '客戶折讓資料',
            breadcrumb: '客戶折讓資料',
            isSpecialPage: false,
            isLinkPage: true
          }
        },
        {
          path: 'FinanceManagement',
          name: '會計傳票',
          component: () => import('@/views/basic-info/FinanceManagement.vue'),
          meta: {
            title: '會計傳票',
            breadcrumb: '會計傳票',
            isAccountsPage: true
          }
        },
        {
          path: 'SpecialInvoice',
          name: '特殊發票處理',
          component: () => import('@/views/basic-info/SpecialInvoice.vue'),
          meta: {
            title: '特殊發票處理',
            breadcrumb: '特殊發票處理',
            isAccountsPage: true
          }
        },
        {
          path: 'SalesControl',
          name: '通知客戶管理',
          component: () => import('@/views/basic-info/SalesControl.vue'),
          meta: {
            title: '通知客戶管理',
            breadcrumb: '通知客戶管理',
            isSpecialPage: true
          }
        },
        {
          path: 'ReportManagement',
          name: '中油鎖卡/解卡處理',
          component: () => import('@/views/basic-info/ReportManagement.vue'),
          meta: {
            title: '中油鎖卡/解卡處理',
            breadcrumb: '中油鎖卡/解卡處理',
            isSpecialPage: true
          }
        },
        // {
        //   path: 'AccessControl',
        //   name: '綁定',
        //   component: () => import('@/views/basic-info/AccessControl.vue'),
        //   meta: {
        //     title: '供應權限管理商資料',
        //     breadcrumb: '供應權限管理商資料',
        //     isSpecialPage: false
        //   }
        // },
        {
        path: 'AccessControl',
        name: '綁定',
        component: AccessControl,
        meta: {
          title: '供應權限管理商資料',
          breadcrumb: '供應權限管理商資料',
          isSpecialPage: false
        }
      },
        {
          path: 'SelectView',
          name: '客戶資料查詢',
          component: () => import('@/views/basic-info/select_update/SelectView.vue'),
          meta: {
            title: '客戶資料查詢',
            breadcrumb: '客戶資料查詢',
          },
          props: route => ({
            customerName: route.query.customerName,
            rowType:route.query.rowType,
            rowData:route.query.rowData,
          }),
        },
        {
          path: 'UpdateView',
          name: '客戶資料編輯',
          component: () => import('@/views/basic-info/select_update/UpdateView.vue'),
          meta: {
            title: '客戶資料編輯',
            breadcrumb: '客戶資料編輯',
          },
          props: route => ({
            customerName: route.query.customerName,
            rowType:route.query.rowType,
          }),
        },
        {
          path: 'CustomerAccounts',
          name: '未核銷帳務',
          component: () => import('@/views/basic-info/Accounts/CustomerAccounts.vue'),
          meta: {
            title: '未核銷帳務',
            breadcrumb: '未核銷帳務',
            isAccountsPage:true,
          },
        },
        {
          path: 'BANKSINOPAC_View',
          name: '刷卡帳務',
          component: () => import('@/views/basic-info/Accounts/bank/BANKSINOPAC_View.vue'),
          meta: {
            title: '刷卡帳務',
            breadcrumb: '刷卡帳務',
            isBankPage:true
          },
        },{
          path: 'TBB_View',
          name: '匯款/支票',
          component: () => import('@/views/basic-info/Accounts/bank/TBB_View.vue'),
          meta: {
            title: '匯款/支票',
            breadcrumb: '匯款/支票',
            isBankPage:true
          },
        },
        {
          path: 'CardMake',
          name: '製卡明細',
          component: () => import('@/views/basic-info/CardMakeView.vue'),
          meta: {
            title: '製卡明細',
            breadcrumb: '製卡明細',
          },
        },{
          path: 'Export',
          name: '匯出車籍中油檔',
          component: () => import('@/views/basic-info/DataProcessing/Export.vue'),
          meta: {
            title: '匯出車籍中油檔',
            breadcrumb: '匯出車籍中油檔',
            isData:true
          },
        },{
          path: 'Import',
          name: '匯入車籍中油檔',
          component: () => import('@/views/basic-info/DataProcessing/Import.vue'),
          meta: {
            title: '匯入車籍中油檔',
            breadcrumb: '匯入車籍中油檔',
            isData:true
          },
        },
      ]
    }
  ]
})

export default router
