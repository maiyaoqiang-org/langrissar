<template>
  <el-link
    :underline="false"
    type="primary"
    @click="handleCopy"
    style="font-size: inherit;"
  >
    {{ text }}
  </el-link>
</template>

<script setup>
import { ElMessage } from 'element-plus'

const props = defineProps({
  text: {
    type: String,
    default: ''
  }
})

/** 复制文本到剪贴板 */
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.text)
    ElMessage.success('已复制到剪贴板')
  } catch (e) {
    const textarea = document.createElement('textarea')
    textarea.value = props.text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    ElMessage.success('已复制到剪贴板')
  }
}
</script>
