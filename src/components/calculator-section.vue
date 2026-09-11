<script setup>
import { ref } from 'vue'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
defineProps({ title: String, summary: String, icon: [Object, Function] })
const expanded = ref(true)
</script>
<template>
  <el-card class="calculator-fold-section" :data-calculator-collapsed="!expanded">
    <template #header>
      <div class="calculator-section-heading">
        <div class="panel-section-title"><el-icon v-if="icon" aria-hidden="true"><component :is="icon" /></el-icon><h2>{{ title }}</h2></div>
        <el-button data-section-toggle text :icon="expanded ? ArrowUp : ArrowDown" :aria-expanded="expanded"
          :aria-label="`${expanded ? '收起' : '展开'}${title}`" @click="expanded = !expanded">{{ expanded ? '收起' : '展开' }}</el-button>
      </div>
      <p v-if="!expanded" class="calculator-section-summary">{{ summary || '已保留本区设置，展开可继续修改。' }}</p>
      <div v-if="$slots.actions" v-show="expanded" class="calculator-section-actions"><slot name="actions" /></div>
    </template>
    <div v-show="expanded"><slot /></div>
  </el-card>
</template>
