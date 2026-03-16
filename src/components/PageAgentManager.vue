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
const modelOptions = ref(["qvq-max-2025-03-25","qwen-math-turbo","qwen1.5-110b-chat","qwen-coder-turbo-0919","qwen3-vl-235b-a22b-thinking","qwen-vl-plus-2025-05-07","qwen2.5-math-7b-instruct","qwen2.5-vl-72b-instruct","qwen-plus-2025-07-28","qwen-vl-plus-latest","qwen2.5-vl-3b-instruct","deepseek-r1-distill-qwen-7b","glm-5","qwen-max","qwen2.5-14b-instruct","qwen-mt-flash","qwen3-vl-30b-a3b-thinking","qwen-vl-ocr-latest","qwen3-32b","qwen2.5-7b-instruct","qwen-vl-max-2025-08-13","qwen1.5-7b-chat","deepseek-r1-distill-qwen-32b","qwen-vl-plus","qwen-long","qwen-coder-plus-latest","qwen3.5-35b-a3b","qwen-max-2025-01-25","glm-4.5-air","qwen3-coder-480b-a35b-instruct","qwen3-vl-8b-thinking","qwen3-coder-plus","opennlu-v1","qwen3.5-flash-2026-02-23","qwen3-vl-flash-2025-10-15","qwen3-max-preview","qwen-vl-ocr-1028","qwen2.5-14b-instruct-1m","qwen3-8b","qwen-plus-0112","gui-plus","qwen-math-plus","qwen-plus","qwen2-vl-72b-instruct","qwen-turbo","qwen2-57b-a14b-instruct","qwen3-0.6b","qwen3-coder-flash","qvq-max","qwen-vl-plus-2025-08-15","qwen2.5-coder-14b-instruct","qwen3-next-80b-a3b-thinking","qwen-vl-max-latest","qwen1.5-14b-chat","qwen3.5-27b","qwen-math-turbo-0919","tongyi-xiaomi-analysis-flash","deepseek-r1","qvq-plus-latest","qwen3-vl-flash","qwen2.5-32b-instruct","qwen-turbo-latest","qwen-math-plus-0919","qwen3-14b","MiniMax-M2.5","qwen-plus-2025-12-01","qwen3-max-2025-09-23","qwen-plus-character","qwen-flash-character","MiniMax-M2.1","deepseek-r1-distill-qwen-14b","qwen-math-turbo-latest","qvq-max-latest","qwen3-30b-a3b-instruct-2507","qwen-flash","qwen-flash-2025-07-28","qwen3-235b-a22b-instruct-2507","qwen2-7b-instruct","qwen3-coder-plus-2025-07-22","qwen-max-latest","kimi-k2.5","qwen-vl-ocr","qwen2.5-coder-32b-instruct","qwen-long-latest","qwen1.5-32b-chat","qwen-vl-ocr-2025-04-13","qwen-max-0428","qwen1.5-72b-chat","qwen-plus-1220","qwen3.5-122b-a10b","qwen-vl-ocr-2025-11-20","qwen-coder-plus-1106","qwen-vl-max-2025-04-02","qwen-vl-max-1119","qwen-vl-max-2025-04-08","tongyi-intent-detect-v3","qwen-vl-max-1230","qwen2.5-7b-instruct-1m","qwen3-max","qwen2-72b-instruct"])

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
