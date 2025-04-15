import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/Login.vue')
    },
    {
      path: '/pages/index/index',
      name: 'Index',
      component: () => import('@/pages/index/index.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const token = localStorage.getItem('token')
  const tokenExpireTime = localStorage.getItem('tokenExpireTime')
  console.log(666);
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!userStore.user || !token || !tokenExpireTime || new Date().getTime() > parseInt(tokenExpireTime)) {
      userStore.clearUser()
      
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router