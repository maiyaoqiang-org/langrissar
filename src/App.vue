<template>
  <router-view></router-view>
</template>

<script setup>
// App.vue now uses composition API
</script>

<style lang="scss">
@import "@/styles/flex.css";
@import "@/styles/mrpd.scss";

/* Global CSS */
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

    > div {
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
</style>