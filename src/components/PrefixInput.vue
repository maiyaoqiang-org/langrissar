<template>
  <div class="prefix-input">
    <span class="prefix">{{ prefix }}</span>
    <el-input 
      v-model="inputValue" 
      :placeholder="placeholder"
      @input="handleInput"
      @change="handleChange"
      @blur="handleBlur"
      @focus="handleFocus"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  prefix: {
    type: String,
    default: '272010011001'
  },
  placeholder: {
    type: String,
    default: '请输入'
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'input', 'blur', 'focus'])

// 计算实际显示的输入值（去掉前缀）
const inputValue = computed({
  get: () => {
    if (!props.modelValue) return ''
    return props.modelValue.startsWith(props.prefix)
      ? props.modelValue.slice(props.prefix.length)
      : props.modelValue
  },
  set: (val) => {
    emit('update:modelValue', props.prefix + val)
  }
})

// 事件处理
const handleInput = (val) => {
  emit('input', props.prefix + val)
}

const handleChange = (val) => {
  emit('change', props.prefix + val)
}

const handleBlur = (event) => {
  emit('blur', event)
}

const handleFocus = (event) => {
  emit('focus', event)
}
</script>

<style scoped>
.prefix-input {
  display: flex;
  align-items: center;
}

.prefix {
  background-color: #f5f7fa;
  padding: 0 8px;
  height: 32px;
  line-height: 32px;
  border: 1px solid #dcdfe6;
  border-right: none;
  border-radius: 4px 0 0 4px;
  color: #606266;
}

.prefix-input :deep(.el-input__wrapper) {
  border-radius: 0 4px 4px 0;
}
</style>