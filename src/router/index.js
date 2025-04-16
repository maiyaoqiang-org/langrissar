import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
export const menuRoutes = [
  {
    path: '/pages/ddjsq-el',
    component: () => import('@/pages/ddjsq-el.vue'),
    meta: { title: '单点计算器' }
  },
  {
    path: '/pages/aoejsq-el',
    component: () => import('@/pages/aoejsq-el.vue'),
    meta: { title: 'AOE计算器' }
  },
  {
    path: '/pages/mbjs-el',
    component: () => import('@/pages/mbjs-el.vue'),
    meta: { title: '面板模拟计算器' }
  },
  {
    path: '/pages/bp-simulate',
    component: () => import('@/pages/bp-simulate.vue'),
    meta: { title: 'BP模拟器' }
  },
]
const routes = [
  {
    path: '/',
    redirect: '/pages/ddjsq-el'
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
  if (!isAuthenticated) {
    next({
      path: '/pages/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router