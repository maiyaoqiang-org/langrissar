<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ArrowDown, Check, Close, Picture, Search } from '@element-plus/icons-vue'
import '@/styles/calculator-picker.css'

const props = defineProps({
  modelValue: [String, Number, Array],
  options: { type: Array, default: () => [] },
  title: { type: String, required: true },
  placeholder: { type: String, default: '请选择' },
  multiple: Boolean,
  clearable: Boolean,
  cascader: Boolean,
})
const emit = defineEmits(['update:modelValue'])
const mobileQuery = window.matchMedia('(max-width: 700px)')
const mobile = ref(mobileQuery.matches)
const opened = ref(false)
const query = ref('')
const draft = ref([])
const activeGroup = ref(null)
const trigger = ref(null)
const list = ref(null)
const groups = ref(null)
const viewportStyle = ref({})

// Keep the original values and ordering, including the cascader's full path.
const allOptions = computed(() => props.cascader
  ? props.options.flatMap(group => (group.children || []).map(item => ({
    ...item, value: [group.value, item.value], group: group.value, groupLabel: group.label,
  })))
  : props.options)
const equal = (a, b) => Array.isArray(a) && Array.isArray(b)
  ? a.length === b.length && a.every((value, index) => value === b[index])
  : a === b
const selectedOptions = computed(() => allOptions.value.filter(item => props.multiple
  ? (props.modelValue || []).includes(item.value)
  : equal(item.value, props.modelValue)))
const selectedText = computed(() => selectedOptions.value.map(item => item.label).join('、')
  || (Array.isArray(props.modelValue) ? props.modelValue.join(' / ') : props.modelValue) || '')
const searchText = computed(() => query.value.trim().toLocaleLowerCase())
const visibleOptions = computed(() => allOptions.value.filter(item => {
  if (searchText.value) return `${item.label} ${item.groupLabel || ''}`.toLocaleLowerCase().includes(searchText.value)
  return !props.cascader || item.group === activeGroup.value
}))
const isSelected = item => props.multiple ? draft.value.includes(item.value) : equal(item.value, props.modelValue)

function updateViewport() {
  const viewport = window.visualViewport
  const height = viewport?.height || window.innerHeight
  viewportStyle.value = {
    '--picker-viewport-height': `${height}px`,
    '--picker-bottom': `${Math.max(0, window.innerHeight - height - (viewport?.offsetTop || 0))}px`,
  }
}
function openPicker() {
  query.value = ''
  draft.value = props.multiple ? [...(props.modelValue || [])] : []
  activeGroup.value = selectedOptions.value[0]?.group ?? props.options[0]?.value ?? null
  updateViewport()
  opened.value = true
}
function choose(item) {
  if (props.multiple) {
    draft.value = draft.value.includes(item.value)
      ? draft.value.filter(value => value !== item.value) : [...draft.value, item.value]
  } else {
    emit('update:modelValue', item.value)
    opened.value = false
  }
}
function confirmMultiple() {
  emit('update:modelValue', [...draft.value])
  opened.value = false
}
function clearSingle() {
  emit('update:modelValue', '')
  opened.value = false
}
async function scrollToSelection() {
  await nextTick()
  const selected = list.value?.querySelector('[aria-selected="true"]')
  if (selected && list.value) {
    list.value.scrollTop += selected.getBoundingClientRect().top - list.value.getBoundingClientRect().top - 12
  }
  const group = groups.value?.querySelector('[aria-pressed="true"]')
  if (group && groups.value) {
    const bottom = group.getBoundingClientRect().bottom - groups.value.getBoundingClientRect().bottom
    if (bottom > 0) groups.value.scrollTop += bottom + 6
  }
}
function finishSearch(event) {
  // Enter used to confirm a Chinese IME candidate must not dismiss the keyboard.
  if (event.isComposing || event.keyCode === 229) return
  event.preventDefault()
  event.target.blur()
}
function navigateOptions(event) {
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
  const rows = [...list.value.querySelectorAll('[role="option"]')]
  if (!rows.length) return
  const current = rows.indexOf(document.activeElement)
  const target = event.key === 'Home' ? 0 : event.key === 'End' ? rows.length - 1
    : Math.min(rows.length - 1, Math.max(0, current + (event.key === 'ArrowDown' ? 1 : -1)))
  event.preventDefault()
  rows[target].focus({ preventScroll: true })
  const rowBounds = rows[target].getBoundingClientRect()
  const listBounds = list.value.getBoundingClientRect()
  if (rowBounds.top < listBounds.top) list.value.scrollTop += rowBounds.top - listBounds.top
  else if (rowBounds.bottom > listBounds.bottom) list.value.scrollTop += rowBounds.bottom - listBounds.bottom
}
function restoreFocus() {
  // A button, never the search input: reopening must not summon the keyboard.
  trigger.value?.focus({ preventScroll: true })
}
function updateMobile(event) {
  mobile.value = event.matches
  opened.value = false
}
watch([query, activeGroup], () => { if (list.value) list.value.scrollTop = 0 })
watch(() => props.options, () => {
  if (opened.value && props.cascader && !props.options.some(group => group.value === activeGroup.value)) {
    activeGroup.value = props.options[0]?.value ?? null
  }
})
watch(opened, value => {
  const action = value ? 'addEventListener' : 'removeEventListener'
  window.visualViewport?.[action]('resize', updateViewport)
  window.visualViewport?.[action]('scroll', updateViewport)
  window[action]('resize', updateViewport)
})
onMounted(() => mobileQuery.addEventListener('change', updateMobile))
onBeforeUnmount(() => {
  mobileQuery.removeEventListener('change', updateMobile)
  window.visualViewport?.removeEventListener('resize', updateViewport)
  window.visualViewport?.removeEventListener('scroll', updateViewport)
  window.removeEventListener('resize', updateViewport)
})
</script>

<template>
  <div class="calculator-picker">
    <button v-if="mobile" ref="trigger" type="button" class="calculator-picker-trigger"
      :class="{ 'is-empty': !selectedText }" :aria-label="`${title}，${selectedText || '未选择'}`"
      aria-haspopup="dialog" :aria-expanded="opened" @click="openPicker">
      <span>{{ selectedText || placeholder }}</span><el-icon aria-hidden="true"><ArrowDown /></el-icon>
    </button>
    <el-cascader v-else-if="cascader" :model-value="modelValue" :options="options" filterable
      :placeholder="placeholder" :aria-label="title" popper-class="calculator-picker-menu"
      @update:model-value="emit('update:modelValue', $event)">
      <template #default="{ data, node }">
        <div class="calculator-picker-option"><span>{{ data.label }}</span>
          <el-image v-if="node.isLeaf && data.image" :src="data.image" fit="contain" alt="" />
        </div>
      </template>
    </el-cascader>
    <el-select v-else :model-value="modelValue" filterable :multiple="multiple" :clearable="clearable"
      :placeholder="placeholder" :aria-label="title" popper-class="calculator-picker-menu"
      no-match-text="没有找到匹配项" no-data-text="暂无可选项" @update:model-value="emit('update:modelValue', $event)">
      <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label">
        <div class="calculator-picker-option"><span>{{ item.label }}</span>
          <el-image v-if="item.image" :src="item.image" fit="contain" alt="" />
        </div>
      </el-option>
    </el-select>

    <!-- ElDrawer focuses its non-input sentinel on opening and locks the page scroll. -->
    <el-drawer v-if="mobile" v-model="opened" direction="btt" size="82%" :title="title" append-to-body
      destroy-on-close :show-close="false" class="calculator-picker-sheet" modal-class="calculator-picker-mask"
      :style="viewportStyle" @opened="scrollToSelection" @closed="restoreFocus">
      <template #header>
        <h2>{{ title }}</h2>
        <button type="button" class="calculator-picker-close" :aria-label="`关闭${title}`" @click="opened = false">
          <el-icon aria-hidden="true"><Close /></el-icon>
        </button>
      </template>
      <div class="calculator-picker-search">
        <el-icon aria-hidden="true"><Search /></el-icon>
        <input v-model="query" type="search" :aria-label="`搜索${title.replace(/^请选择|^选择/, '')}`"
          :placeholder="cascader ? '搜索全部士兵或兵种' : '输入名称搜索'" autocomplete="off" autocapitalize="off"
          enterkeyhint="done" @keydown.enter="finishSearch">
        <button v-if="query" type="button" aria-label="清空搜索" @click="query = ''"><el-icon><Close /></el-icon></button>
      </div>
      <p class="calculator-picker-summary" aria-live="polite">
        {{ searchText ? `找到 ${visibleOptions.length} 项` : multiple ? '可选择多项，完成后应用' : '点击一项即可选择' }}
      </p>
      <div class="calculator-picker-content">
        <nav v-if="cascader && !searchText" ref="groups" class="calculator-picker-groups" aria-label="士兵兵种">
          <button v-for="group in options" :key="group.value" type="button"
            :aria-pressed="activeGroup === group.value" @click="activeGroup = group.value">{{ group.label }}</button>
        </nav>
        <div ref="list" class="calculator-picker-list" role="listbox" :aria-label="`${title}列表`" :aria-multiselectable="multiple"
          @keydown="navigateOptions">
          <button v-for="item in visibleOptions" :key="JSON.stringify(item.value)" type="button" role="option"
            class="calculator-picker-row" :aria-selected="isSelected(item)" @click="choose(item)">
            <span class="calculator-picker-label">{{ item.label }}
              <small v-if="cascader && searchText">{{ item.groupLabel }}</small>
            </span>
            <span class="calculator-picker-thumbnail" aria-hidden="true">
              <el-image v-if="item.image" :src="item.image" fit="contain" alt="" loading="lazy">
                <template #error><el-icon><Picture /></el-icon></template>
              </el-image>
              <el-icon v-else><Picture /></el-icon>
            </span>
            <span class="calculator-picker-check" :class="{ 'is-multiple': multiple }" aria-hidden="true">
              <el-icon v-if="isSelected(item)"><Check /></el-icon>
            </span>
          </button>
          <div v-if="!visibleOptions.length" class="calculator-picker-empty" role="status">
            <el-icon aria-hidden="true"><Search /></el-icon>
            <p>{{ searchText ? '没有找到匹配项' : '暂无可选项' }}</p>
            <span v-if="searchText">试试名称中的几个字</span>
          </div>
        </div>
      </div>
      <template v-if="multiple || clearable" #footer>
        <template v-if="multiple">
          <el-button :disabled="!draft.length" @click="draft = []">清空选择</el-button>
          <el-button type="primary" @click="confirmMultiple">完成{{ draft.length ? `（${draft.length}）` : '' }}</el-button>
        </template>
        <el-button v-else @click="clearSingle">清除选择</el-button>
      </template>
    </el-drawer>
  </div>
</template>
