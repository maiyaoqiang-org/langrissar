import { evaluate } from 'mathjs'

// Invalid input is a UI state, never a replacement numeric value.
export function analyzeCalculatorFormula(input, defaultValue = 0) {
  const text = String(input ?? '').trim()
  if (!text) return { state: 'valid', value: defaultValue, formula: false }
  if (!/^[\d+\-*/().\s]+$/.test(text)) return { state: 'invalid', message: '请使用数字、英文运算符和括号' }
  let depth = 0
  for (const character of text) {
    if (character === '(') depth++
    if (character === ')' && --depth < 0) return { state: 'invalid', message: '请检查括号是否配对' }
  }
  if (depth > 0 || /[+\-*/.(]$/.test(text)) return { state: 'incomplete', message: '公式尚未完成' }
  try {
    const value = evaluate(text)
    if (typeof value !== 'number' || !Number.isFinite(value)) return { state: 'invalid', message: '无法计算，请检查是否除以零' }
    return { state: 'valid', value, formula: !/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(text) }
  } catch { return { state: 'invalid', message: '公式有误，请检查运算符和括号' } }
}
