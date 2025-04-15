import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/pages/index.vue'),
    meta: { title: '计算器' }
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
  {
    path: '/pages/ddjsq-el',
    component: () => import('@/pages/ddjsq-el.vue'),
    meta: { title: '单点计算器' }
  },
//   {
//     path: '/aoejsq',
//     component: () => import('@/pages/aoejsq.vue'),
//     meta: { title: 'AOE计算器' }
//   },
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
  {
    path: '/pages/test',
    component: () => import('@/pages/test.vue'),
    meta: { title: '测试' }
  },
  {
    path: '/pages/Login',
    component: () => import('@/pages/Login.vue'),
    meta: { title: '登录' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router