<template>
  <el-container>
    <el-aside width="200px">
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
          <div style="flex-grow: 1"></div>
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
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
        <HideContentButton />
      </el-main>
      <el-footer height="40px">
        <div class="footer-content">
          <a href="https://beian.miit.gov.cn/" target="_blank" class="beian-link">粤ICP备2025406882号</a>
        </div>
      </el-footer>
    </el-container>
  </el-container>
  <ChangePasswordDialog ref="changePasswordDialogRef" />
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { menuRoutes } from '@/router'
import { computed, ref } from 'vue'
import ChangePasswordDialog from '@/components/ChangePasswordDialog.vue'
import HideContentButton from './components/HideContentButton.vue';

import RecursiveMenu from '@/components/RecursiveMenu.vue'

const userStore = useUserStore()
const router = useRouter()

// 过滤菜单路由
const filteredMenuRoutes = computed(() => {
  return menuRoutes.filter(route => {
    if (route.meta.requiresAuth && !userStore.user) {
      return false
    }
    return route.meta.requiresAdmin ? userStore.user.role === 'admin' : true
  })
})

// 处理下拉菜单命令
const changePasswordDialogRef = ref(null)

const handleCommand = (command) => {
  if (command === 'logout') {
    userStore.logout()
    router.push('/pages/login')
  } else if (command === 'changePassword') {
    changePasswordDialogRef.value?.show()
  }
}

</script>

<style lang="scss">
@import "@/styles/flex.css";
@import "@/styles/mrpd.scss";

body {
  margin: 0;
  min-width: 800px;
}

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
  border-right: none;
  height: calc(100vh - 60px);
}

.el-aside {
  --el-menu-bg-color:#001529;
  --el-menu-text-color:#fff;
  --el-menu-active-color:#409eff;
  --el-menu-hover-bg-color:#40a0ffbe;
  // background-color: #001529;
  // color: white;

  // .el-menu {
  //   background-color: #001529;

  //   .el-menu-item {
  //     color: #fff;

  //     &:hover,
  //     &.is-active {
  //       background-color: #1890ff;
  //     }
  //   }
  // }
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

img {
  max-width: 100%;
  height: auto;
}

.primary {
  color: var(--el-color-primary);
}

.success {
  color: var(--el-color-success);
}

.warning {
  color: var(--el-color-warning);
}

.error {
  color: var(--el-color-error);
}

.base-el-form {
  .average-box {
    display: flex;
    font-size: 18px;

    >div {
      flex: 1;
    }

    .value {
      font-size: 20px;
    }
  }

  .card-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;

    .el-card {
      width: 640px;
    }
  }
}

.search-form.el-form--inline {
  .el-input {
    --el-inpput-width: 200px;
    width: var(--el-inpput-width);
  }

  .el-select {
    --el-select-width: 200px;
  }

  .el-date-editor.el-input {
    --el-date-editor-width: 200px;
  }
}
</style>