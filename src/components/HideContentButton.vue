<template>
  <div v-if="useHide" class="hide-content-button" @click="toggleHideContent">
    <el-button type="primary" circle>
      <el-icon>
        <component :is="hideContent ? 'View' : 'Hide'" />
      </el-icon>
    </el-button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { View, Hide } from '@element-plus/icons-vue';

const hideContent = ref(false);
const useHide = ref(import.meta.env.DEV);

const toggleHideContent = () => {
  hideContent.value = !hideContent.value;
  document.body.classList.toggle('content-hidden');
};

onMounted(() => {
  if (useHide.value) {
    hideContent.value = true;
    document.body.classList.add('content-hidden');
  }
});

onUnmounted(() => {
  document.body.classList.remove('content-hidden');
});
</script>

<style>
/* 全局样式 */
.content-hidden {
  color: transparent !important;
  text-shadow: 0 0 8px rgba(0,0,0,0.3);
}

.content-hidden *:not(.hide-content-button *) {
  color: transparent !important;
  text-shadow: 0 0 8px rgba(0,0,0,0.3);
  user-select: unset !important;
}

.content-hidden img:not(.hide-content-button img) {
  display: none !important;
}
</style>

<style scoped>
.hide-content-button {
  position: fixed;
  bottom: 100px;
  right: 20px;
  z-index: 9999;
  cursor: pointer;
}
</style>
