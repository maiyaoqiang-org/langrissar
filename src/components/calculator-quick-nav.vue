<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Aim, List, RefreshLeft } from '@element-plus/icons-vue'
const opened = ref(false)
const sections = ref([])
const returnPosition = ref(null)
const editing = ref(false)
const behavior = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

function scanSections() {
  return [...document.querySelectorAll('[data-calculator-section]')].filter(element => element.getClientRects().length && element.getBoundingClientRect().height)
}
function openDirectory() {
  sections.value = scanSections().map(element => ({ id: element.id, label: element.dataset.calculatorSection, result: element.hasAttribute('data-calculator-result') }))
  opened.value = true
}
async function goTo(id, remember = false) {
  const target = document.getElementById(id)
  if (!target) return
  if (remember) returnPosition.value = window.scrollY
  if (target.dataset.calculatorCollapsed === 'true') target.querySelector('[data-section-toggle]')?.click()
  if (target.classList.contains('calculator-guide-toggle')) target.querySelector('button[aria-expanded="false"]')?.click()
  opened.value = false
  await nextTick()
  target.scrollIntoView({ behavior: behavior(), block: 'start' })
}
function jumpResult() {
  if (returnPosition.value !== null) {
    window.scrollTo({ top: returnPosition.value, behavior: behavior() })
    returnPosition.value = null
    return
  }
  const result = scanSections().find(element => element.hasAttribute('data-calculator-result'))
  if (result) goTo(result.id, true)
}
function goTop() {
  opened.value = false
  returnPosition.value = null
  window.scrollTo({ top: 0, behavior: behavior() })
}
function checkEditing() {
  requestAnimationFrame(() => { editing.value = window.matchMedia('(max-width: 700px)').matches && /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName) })
}
onMounted(() => {
  document.addEventListener('focusin', checkEditing)
  document.addEventListener('focusout', checkEditing)
})
onBeforeUnmount(() => {
  document.removeEventListener('focusin', checkEditing)
  document.removeEventListener('focusout', checkEditing)
})
</script>
<template>
  <nav v-show="!editing && !opened" class="calculator-quick-nav" aria-label="页面快捷操作">
    <el-button :icon="List" @click="openDirectory">页面目录</el-button>
    <el-button type="primary" :icon="returnPosition !== null ? RefreshLeft : Aim" @click="jumpResult">{{ returnPosition !== null ? '返回修改位置' : '查看结果' }}</el-button>
  </nav>
  <el-dialog v-model="opened" title="页面目录" class="calculator-directory-dialog" :append-to-body="true">
    <div class="calculator-directory-links">
      <el-button v-for="section in sections" :key="section.id" :class="{ 'is-result-link': section.result }"
        @click="goTo(section.id, section.result)">{{ section.label }}</el-button>
    </div>
    <template #footer><el-button @click="goTop">返回顶部</el-button></template>
  </el-dialog>
</template>
