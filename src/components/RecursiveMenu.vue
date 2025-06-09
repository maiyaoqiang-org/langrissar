<template>
  <template v-for="route in routes" :key="route.path">
    <el-sub-menu v-if="route.children && route.children.length" :index="route.path">
      <template #title>
        <span>{{ route.meta?.title }}</span>
      </template>
      <RecursiveMenu :routes="route.children" />
    </el-sub-menu>
    <el-menu-item v-else :index="route.path">
      <span>{{ route.meta?.title }}</span>
    </el-menu-item>
  </template>
</template>

<script setup>
defineProps({
  routes: {
    type: Array,
    required: true
  }
})
</script>