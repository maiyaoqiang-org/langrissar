import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loginTime: null
  }),
  persist: {
    enabled: true,
    debug: true
  },
  getters: {
    isAuthenticated: (state) => {
      if (!state.user?.token) return false
      return state.user.expireIn && state.loginTime && 
        (new Date().getTime() - state.loginTime) < state.user.expireIn
    },
    currentUser: (state) => state.user
  },
  actions: {
    setUser(user) {
      this.user = user
      this.loginTime = new Date().getTime()
    },
    clearUser() {
      this.user = null
    }
  }
})