import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
export const menuRoutes = [
  {
    path: '/pages/ddjsq-el',
    component: () => import('@/pages/ddjsq-el.vue'),
    meta: { title: '单点计算器', requiresAuth: false }
  },
  {
    path: '/pages/aoejsq-el',
    component: () => import('@/pages/aoejsq-el.vue'),
    meta: { title: 'AOE计算器', requiresAuth: false }
  },
  {
    path: '/pages/mbjs-el',
    component: () => import('@/pages/mbjs-el.vue'),
    meta: { title: '面板模拟计算器', requiresAuth: false }
  },
  {
    path: '/pages/bp-simulate',
    component: () => import('@/pages/bp-simulate.vue'),
    meta: { title: 'BP模拟器', requiresAuth: false }
  },
  {
    path: '/pages/invitation-code',
    component: () => import('@/pages/invitation-code.vue'),
    meta: { title: '邀请码管理', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/pages/user-management',
    component: () => import('@/pages/user-management.vue'),
    meta: { title: '用户管理', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/pages/account-management',
    component: () => import('@/pages/account-management.vue'),
    meta: { title: '领奖账号管理', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/pages/coze',
    component: () => import('@/pages/coze.vue'),
    meta: { title: '扣子配置', requiresAuth: true, requiresAdmin: false }
  },
  {
    path: '/pages/openai-management',
    component: () => import('@/pages/openai-management.vue'),
    meta: { title: 'AI', requiresAuth: true, requiresAdmin: false }
  },
]
const routes = [
  {
    path: '/',
    redirect: menuRoutes[0].path
  },
//   {
//     path: '/jyjsq',
//     component: () => import('@/pages/jyjsq.vue'),
//     meta: { title: '简易计算器' }
//   },
//   {
//     path: '/ddjsq',
//     component: () => import('@/pages/ddjsq.vue'),
//     meta: { title: '单点计算器' }
//   },
//   {
//     path: '/aoejsq',
//     component: () => import('@/pages/aoejsq.vue'),
//     meta: { title: 'AOE计算器' }
//   },
  ...menuRoutes,
  {
    path: '/pages/test',
    component: () => import('@/pages/test.vue'),
    meta: { title: '测试' }
  },
  {
    path: '/pages/login',
    component: () => import('@/pages/login.vue'),
    meta: { title: '登录' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 全局导航守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isAuthenticated = userStore.isAuthenticated
  
  // 如果是登录页面，直接放行
  if (to.path === '/pages/login') {
    next()
    return
  }

  // 如果路由需要登录且用户未登录，则重定向到登录页
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  
  if (requiresAuth && !isAuthenticated) {
    next({
      path: '/pages/login',
      query: { redirect: to.fullPath }
    })
  } else if (requiresAdmin && userStore.user?.role !== 'admin') {
    next('/')
  } else {
    next()
  }
})

export default router