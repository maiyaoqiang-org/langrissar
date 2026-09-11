<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { menuRoutes } from '@/router'
import { computed, ref } from 'vue'
import ChangePasswordDialog from '@/components/ChangePasswordDialog.vue'
import HideContentButton from '@/components/HideContentButton.vue'
import PageAgentManager from '@/components/PageAgentManager.vue'
import RecursiveMenu from '@/components/RecursiveMenu.vue'
import CalculatorQuickNav from '@/components/calculator-quick-nav.vue'
import '../styles/calculator-experience.css'

const pageAgentManagerRef = ref(null)

const toggleAgent = () => {
  pageAgentManagerRef.value?.toggle()
}

const userStore = useUserStore()
const router = useRouter()
const isCalculator = computed(() => ['/pages/ddjsq-el', '/pages/aoejsq-el', '/pages/mbjs-el'].includes(router.currentRoute.value.path))
const calculatorRoutes = menuRoutes.find(route => route.path === '/jsq').children
  .filter(route => !route.meta.requiresAuth)

const hasVisibleChildren = (route, user) => {
  if (!route.children || route.children.length === 0) {
    return true
  }

  return route.children.some(child => {
    if (child.meta?.requiresAuth && !userStore.isAuthenticated) {
      return false
    }
    if (child.meta?.requiresAdmin && user?.role !== 'admin') {
      return false
    }
    return true
  })
}

const filterRoutes = (routes, user) => {
  return routes.map(route => {
    const newRoute = { ...route }
    
    if (route.meta?.requiresAuth && !userStore.isAuthenticated) {
      return null
    }

    if (route.meta?.requiresAdmin && user?.role !== 'admin') {
      return null
    }

    if (route.children && route.children.length > 0) {
      const filteredChildren = filterRoutes(route.children, user)

      if (filteredChildren.length > 0) {
        newRoute.children = filteredChildren
        return newRoute
      }

      if (hasVisibleChildren(route, user)) {
        return newRoute
      }
    }

    return newRoute
  }).filter(Boolean)
}

const filteredMenuRoutes = computed(() => {
  return filterRoutes([...menuRoutes], userStore.user)
})

const changePasswordDialogRef = ref(null)

const handleCommand = (command) => {
  if (command === 'logout') {
    userStore.logout()
    pageAgentManagerRef.value?.dispose()
    router.push('/pages/login')
  } else if (command === 'changePassword') {
    changePasswordDialogRef.value?.show()
  }
}
</script>

<template>
  <el-container :class="{ 'calculator-layout': isCalculator }">
    <el-aside v-if="!isCalculator" width="200px">
      <div class="logo">
        <h2>梦战工具</h2>
      </div>
      <el-menu class="el-menu-vertical" mode="vertical" :router="true" :default-active="$route.path">
        <RecursiveMenu :routes="filteredMenuRoutes" />
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-content">
          <div v-if="isCalculator" class="calculator-brand">梦战工具</div>
          <template v-else>
            <div style="flex-grow: 1"></div>
            <el-button v-if="userStore.isAuthenticated" type="primary" @click="toggleAgent" style="margin-right: 12px;">
              {{ pageAgentManagerRef?.isPanelVisible ? '关闭' : '开启' }} Agent
            </el-button>
            <el-button v-if="!userStore.user" type="primary" @click="router.push('/pages/login')">登录</el-button>
            <div class="user-info" v-if="userStore.user">
              <el-dropdown @command="handleCommand">
                <div class="avatar-container">
                  <el-avatar :size="32">
                    {{ userStore.user.username?.charAt(0) }}
                  </el-avatar>
                  <span class="nickname">{{ userStore.user.username }}</span>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
          <nav v-if="isCalculator" class="calculator-navigation" aria-label="计算器">
            <router-link v-for="item in calculatorRoutes" :key="item.path" :to="item.path">
              {{ item.meta.title }}
            </router-link>
          </nav>
        </div>
      </el-header>
      <el-main id="page-container">
        <router-view></router-view>
      </el-main>
      <el-footer height="40px">
        <div class="footer-content">
          <a href="https://beian.miit.gov.cn/" target="_blank" class="beian-link">粤ICP备2025406882号</a>
          <a href="https://beian.mps.gov.cn/#/query/webSearch?code=44200102446296" target="_blank" class="beian-link">粤公网安备44200102446296号</a>
        </div>
      </el-footer>
    </el-container>
  </el-container>
  <ChangePasswordDialog v-if="!isCalculator" ref="changePasswordDialogRef" />
  <CalculatorQuickNav v-if="isCalculator" :key="$route.path" />
  <PageAgentManager v-if="!isCalculator" ref="pageAgentManagerRef" />
</template>

<style lang="scss" scoped>
.el-container {
  height: 100vh;
}

.header-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #001529;

  h2 {
    color: white;
    margin: 0;
  }
}

.el-menu-vertical {
  border-right: none !important;
  height: calc(100vh - 60px) !important;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #409eff;
    border-radius: 8px;
  }
}

.el-aside {
  --el-menu-bg-color:#001529;
  --el-menu-text-color:#fff;
  --el-menu-active-color:#409eff;
  --el-menu-hover-bg-color:#40a0ffbe;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
}

.el-main {
  background-color: #f5f7fa;
  height: calc(100vh - 100px);
  overflow-y: auto;
}

.el-footer {
  background-color: #f5f7fa;
  border-top: 1px solid #dcdfe6;
  padding: 0;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 16px;
}

.beian-link {
  color: #909399;
  text-decoration: none;
  font-size: 12px;

  &:hover {
    color: #409EFF;
  }
}

.user-info {
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.avatar-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  outline: none !important;
}

.el-dropdown {
  outline: none !important;
  border: none !important;
}

.el-dropdown:focus,
.el-dropdown:focus-visible,
.el-dropdown:hover,
.el-dropdown:active {
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}

.el-dropdown * {
  outline: none !important;
  border: none !important;
}

.el-dropdown:focus-visible {
  outline: none !important;
}

.el-dropdown:hover {
  border-color: transparent !important;
}

.nickname {
  margin-left: 8px;
  font-size: 14px;
  color: #303133;
}

.el-dropdown-menu {
  padding: 5px 0;
}

.el-dropdown-menu__item {
  padding: 8px 20px;
}
</style>

<style src="@/styles/single-point-visual.css"></style>
<style src="@/styles/calculator-panel-visual.css"></style>
