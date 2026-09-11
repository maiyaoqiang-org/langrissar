<script setup>
import { inject } from 'vue'
import { calculatorInputStateKey } from '@/common/calculator-input-state'
const inputState = inject(calculatorInputStateKey, null)
</script>
<template>
  <p v-if="inputState?.hasIssues.value" class="calculator-input-notice" role="status">
    有 {{ inputState.issues.value.length }} 项公式待完善，当前结果暂用这些项目上次的有效值。
  </p>
</template>
