<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'

const route = useRoute()

const layout = computed(() => {
  const layoutName = route.meta?.layout || 'main'
  return layoutName === 'blank' ? BlankLayout : MainLayout
})
</script>

<template>
  <component :is="layout">
    <router-view></router-view>
  </component>
</template>

<style lang="scss">
@import "@/styles/flex.css";
@import "@/styles/mrpd.scss";

body {
  margin: 0;
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
