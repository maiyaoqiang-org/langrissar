<template>
  <el-dialog v-model="isModelDialogVisible" title="选择或输入模型" width="30%">
    <el-select v-model="selectedModel" placeholder="请选择或输入模型" filterable allow-create>
      <el-option v-for="item in modelOptions" :key="item" :label="item" :value="item" />
    </el-select>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isModelDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmModelAndStartAgent">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, readonly } from 'vue'
import { PageAgent } from 'page-agent'

const agent = ref(null)
const isPanelVisible = ref(false)
const isModelDialogVisible = ref(false)
const selectedModel = ref('qwen2.5-7b-instruct')
const modelOptions = ref([
  'qvq-max-2025-03-25', 
  'qwen-math-turbo', 
  'qwen1.5-110b-chat',
  'qwen-coder-turbo-0919',
  'qwen3-vl-235b-a22b-thinking',
  'qwen-vl-plus-2025-05-07',
  'qwen2.5-math-7b-instruct',
  'qwen2.5-vl-72b-instruct',
  'qwen-plus-2025-07-28',
  'qwen-vl-plus-latest',
  'qwen2.5-vl-3b-instruct',
  'deepseek-r1-distill-qwen-7b',
  'glm-5',
  'qwen-max',
  'qwen2.5-14b-instruct',
  'qwen-mt-flash',
  'qwen3-vl-30b-a3b-thinking',
  'qwen-vl-ocr-latest',
  'qwen3-32b',
  'qwen2.5-7b-instruct'
])

const toggle = () => {
  if (!agent.value) {
    isModelDialogVisible.value = true
  } else {
    if (isPanelVisible.value) {
      agent.value.panel.hide()
      isPanelVisible.value = false
    } else {
      agent.value.panel.show()
      isPanelVisible.value = true
    }
  }
}

const stop = () => {
  if (agent.value) {
    agent.value.stop() // 这会触发 onDispose
  }
}

const confirmModelAndStartAgent = () => {
  if (!selectedModel.value) {
    // Can add a message here, e.g., using ElMessage.
    return
  }
  agent.value = new PageAgent({
    model: selectedModel.value,
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    // 请将 YOUR_API_KEY 替换为您的有效 API Key
    apiKey: 'sk-3f662761e4344d88818b75d845a9a923',
    language: 'zh-CN',
    onDispose: () => {
      agent.value = null
      isPanelVisible.value = false
    }
  })
  agent.value.panel.show()
  isPanelVisible.value = true
  isModelDialogVisible.value = false
}

defineExpose({
  toggle,
  stop,
  isPanelVisible: readonly(isPanelVisible),
  agent: readonly(agent)
})
</script>
