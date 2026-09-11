<script setup>
import CalculatorFormulaInput from './calculator-formula-input.vue'
defineOptions({ inheritAttrs: false })
</script>

<template>
  <CalculatorFormulaInput v-bind="$attrs" percent />
</template>
