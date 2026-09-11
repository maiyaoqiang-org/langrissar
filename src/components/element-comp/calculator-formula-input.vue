<script setup>
import { computed, inject, nextTick, onBeforeUnmount, ref, useAttrs, useId, watch, watchEffect } from 'vue'
import { useFormItem } from 'element-plus'
import Big from 'big.js'
import { analyzeCalculatorFormula } from '@/common/calculator-formula.mjs'
import { formatCalculatorNumber } from '@/common/calculator-display.mjs'
import { calculatorInputStateKey } from '@/common/calculator-input-state'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  formData: { type: Object, required: true }, prop: { type: [String, Number], required: true },
  placeholder: { type: String, default: '0' }, defaultValue: { type: Number, default: 0 },
  justShow: Boolean, percent: Boolean, disabled: Boolean,
})
const attrs = useAttrs()
const { formItem } = useFormItem()
const inputState = inject(calculatorInputStateKey, null)
const feedbackId = useId()
const input = ref(null)
const raw = ref('')
const focused = ref(false)
const formulaKeyboard = ref(false)
const disabled = computed(() => props.disabled)
const key = computed(() => `${props.percent ? '_mz_percent_input_' : '_mz_input_'}${props.prop}`)
const analysis = computed(() => analyzeCalculatorFormula(raw.value, props.defaultValue))
const invalid = computed(() => !disabled.value && !props.justShow && analysis.value.state !== 'valid')
const previewValue = computed(() => analysis.value.state === 'valid'
  ? `${formatCalculatorNumber(analysis.value.value)}${props.percent ? '%' : ''}` : '')
const inputAttrs = () => {
  const { class: className, style, ...rest } = attrs
  return rest
}
let committing = false

function formatExternal(value) {
  if (value === undefined || value === null || value === '') return ''
  try { return new Big(value).times(props.percent ? 100 : 1).toFixed() }
  catch { return '' }
}
watch(() => [props.formData, props.formData[props.prop]], (next, previous) => {
  if (committing) return
  const saved = props.formData[key.value]
  const freshData = !previous || next[0] !== previous[0]
  const parsed = analyzeCalculatorFormula(saved, props.defaultValue)
  const savedMatches = parsed.state === 'valid' && parsed.value / (props.percent ? 100 : 1) === Number(next[1])
  raw.value = freshData && saved !== undefined && (savedMatches || parsed.state !== 'valid')
    ? String(saved) : formatExternal(next[1])
}, { immediate: true, flush: 'sync' })

function updateRaw(value) {
  raw.value = value
  const parsed = analyzeCalculatorFormula(value, props.defaultValue)
  committing = true
  try {
    props.formData[key.value] = value
    if (parsed.state === 'valid') props.formData[props.prop] = new Big(parsed.value / (props.percent ? 100 : 1)).toNumber()
  } finally { committing = false }
}
async function insertSymbol(symbol) {
  const field = input.value?.input
  const start = field?.selectionStart ?? raw.value.length
  const end = field?.selectionEnd ?? start
  updateRaw(raw.value.slice(0, start) + symbol + raw.value.slice(end))
  await nextTick()
  field?.focus()
  field?.setSelectionRange(start + symbol.length, start + symbol.length)
}
async function toggleKeyboard() {
  formulaKeyboard.value = !formulaKeyboard.value
  await nextTick()
  input.value?.focus()
}
function handleFocusOut(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) focused.value = false
}
watchEffect(() => {
  inputState?.update(feedbackId, invalid.value ? { label: formItem?.label || String(props.prop), state: analysis.value.state } : null)
})
onBeforeUnmount(() => inputState?.update(feedbackId, null))
</script>

<template>
  <div v-if="!justShow" class="calculator-formula-field" :class="[attrs.class, { 'has-formula-issue': invalid }]" :style="attrs.style"
    @focusin="focused = true" @focusout="handleFocusOut">
    <el-input ref="input" v-bind="inputAttrs()" :model-value="disabled ? formatCalculatorNumber(formatExternal(formData[prop])) : raw" :placeholder="placeholder" :disabled="disabled"
      :inputmode="formulaKeyboard ? 'text' : 'decimal'" :aria-invalid="invalid ? 'true' : undefined"
      :aria-describedby="(invalid || focused || analysis.formula) ? feedbackId : undefined"
      @update:model-value="updateRaw">
      <template v-if="percent" #append>%</template>
    </el-input>
    <div v-if="!disabled && (invalid || focused || analysis.formula)" :id="feedbackId" class="calculator-formula-feedback">
      <span v-if="invalid" class="calculator-formula-error">{{ analysis.message }}{{ analysis.state === 'incomplete' && focused ? '，继续输入即可' : '，暂用上次有效值' }}</span>
      <span v-else-if="analysis.formula" class="calculator-formula-preview">= {{ previewValue }}</span>
      <span v-else class="calculator-formula-hint">支持公式计算</span>
      <button v-if="focused" type="button" class="calculator-keyboard-toggle" :aria-pressed="formulaKeyboard"
        @pointerdown.prevent @click="toggleKeyboard">{{ formulaKeyboard ? '数字键盘' : '输入公式' }}</button>
    </div>
    <div v-if="focused && formulaKeyboard && !disabled" class="calculator-formula-symbols" aria-label="公式运算符">
      <button v-for="symbol in ['+', '-', '*', '/', '(', ')']" :key="symbol" type="button"
        :aria-label="`插入 ${symbol}`" @pointerdown.prevent @click="insertSymbol(symbol)">{{ { '*': '×', '/': '÷', '-': '−' }[symbol] || symbol }}</button>
    </div>
  </div>
  <div v-else>{{ formatCalculatorNumber(formatExternal(formData[prop])) }}</div>
</template>
