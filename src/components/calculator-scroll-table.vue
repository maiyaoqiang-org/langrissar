<script setup>
import { nextTick, onBeforeUnmount, onMounted, onUpdated, ref } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

defineProps({
  label: { type: String, required: true },
  hint: { type: String, default: '左右滑动，查看其余属性' },
})

const root = ref(null)
const toolbar = ref(null)
const overflowing = ref(false)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const toolbarHeight = ref(0)
let scrollArea
let observer
let frame

function measure() {
  if (!scrollArea) return
  const remaining = scrollArea.scrollWidth - scrollArea.clientWidth
  overflowing.value = remaining > 1
  canScrollLeft.value = scrollArea.scrollLeft > 1
  canScrollRight.value = scrollArea.scrollLeft < remaining - 1
  toolbarHeight.value = toolbar.value?.offsetHeight || 0
}

function scheduleMeasure() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(measure)
}

function connect() {
  const next = root.value?.querySelector('.el-table__body-wrapper .el-scrollbar__wrap')
  if (next !== scrollArea) {
    scrollArea?.removeEventListener('scroll', scheduleMeasure)
    observer?.disconnect()
    scrollArea = next
    if (scrollArea) {
      scrollArea.addEventListener('scroll', scheduleMeasure, { passive: true })
      ;[root.value, toolbar.value, scrollArea, scrollArea.querySelector('table')]
        .filter(Boolean).forEach(element => observer?.observe(element))
    }
  }
  scheduleMeasure()
}

function scroll(direction) {
  if (!scrollArea) return
  const cells = root.value.querySelectorAll('.el-table__body tr:first-child td')
  const fixedWidth = cells[0]?.getBoundingClientRect().width || 0
  const columnWidth = cells[1]?.getBoundingClientRect().width || 152
  const columnsPerStep = Math.max(1, Math.floor((scrollArea.clientWidth - fixedWidth) / columnWidth))
  scrollArea.scrollBy({
    left: direction * columnWidth * columnsPerStep,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  })
}

onMounted(async () => {
  observer = new ResizeObserver(scheduleMeasure)
  await nextTick()
  connect()
})
onUpdated(connect)
onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  scrollArea?.removeEventListener('scroll', scheduleMeasure)
  observer?.disconnect()
})
</script>

<template>
  <section ref="root" class="panel-scroll-table" :aria-label="label"
    :class="{ 'has-more-left': canScrollLeft, 'has-more-right': canScrollRight }"
    :style="{ '--table-toolbar-height': `${toolbarHeight}px` }">
    <div v-show="overflowing" ref="toolbar" class="panel-table-toolbar">
      <span class="panel-table-hint">{{ hint }}</span>
      <div class="panel-table-scroll-actions">
        <el-button :icon="ArrowLeft" :disabled="!canScrollLeft" :aria-label="`${label}：向左查看`" @click="scroll(-1)" />
        <el-button :icon="ArrowRight" :disabled="!canScrollRight" :aria-label="`${label}：向右查看`" @click="scroll(1)" />
      </div>
    </div>
    <slot />
  </section>
</template>
