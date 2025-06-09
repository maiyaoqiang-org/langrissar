<template>
  <el-card class="not-found-card">
    <template #header>
      <div class="card-header">
        <el-icon :size="50" color="#F56C6C"><Warning /></el-icon>
        <h1>404 - 页面未找到</h1>
      </div>
    </template>
    
    <div class="content">
      <p>您访问的页面不存在或已被移除</p>
      <el-button 
        type="primary" 
        @click="$router.push('/')"
        class="home-button"
      >
        <el-icon><HomeFilled /></el-icon>
        <span>返回首页</span>
      </el-button>
    </div>
  </el-card>
</template>

<script setup>
import { Warning, HomeFilled } from '@element-plus/icons-vue'
</script>

<style scoped>
.not-found-card {
  max-width: 600px;
  margin: 100px auto;
  text-align: center;
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.content {
  padding: 20px 0;
}

.home-button {
  margin-top: 30px;
  padding: 12px 24px;
  font-size: 16px;
}

h1 {
  color: #F56C6C;
  margin: 0;
}

p {
  font-size: 18px;
  color: #606266;
  margin-bottom: 30px;
}
</style>

<script>
export default {
  name: 'NotFound'
}
</script>