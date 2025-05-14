import { useUserStore } from '@/stores/user'

export const hasRole = {
  mounted(el, binding) {
    const userStore = useUserStore()
    const { value } = binding
    const userRole = userStore.user?.role
    
    // 判断是数组还是字符串
    const hasPermission = Array.isArray(value)
      ? value.includes(userRole)
      : userRole === value
    
    if (!hasPermission) {
      el.parentNode?.removeChild(el)
    }
  }
}