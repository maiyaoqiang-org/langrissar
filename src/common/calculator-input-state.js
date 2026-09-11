import { computed, provide, reactive } from 'vue'
export const calculatorInputStateKey = Symbol('calculatorInputState')
export function useCalculatorInputState() {
  const fields = reactive(new Map())
  const issues = computed(() => [...fields.values()])
  const hasIssues = computed(() => issues.value.length > 0)
  const state = { issues, hasIssues, update(id, issue) {
    if (issue) fields.set(id, issue)
    else fields.delete(id)
  } }
  provide(calculatorInputStateKey, state)
  return state
}
