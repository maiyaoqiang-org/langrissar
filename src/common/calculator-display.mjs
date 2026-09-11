import Big from 'big.js'

// Presentation only: never use rounded display strings as calculation inputs.
export function formatCalculatorNumber(value) {
  if (value === null || value === undefined || value === '') return ''
  try {
    const number = typeof value === 'string' ? value.trim().replace(/^\+/, '') : value
    return new Big(number).round(2, Big.roundHalfUp).toFixed()
  } catch { return String(value) }
}

export function formatCalculatorPercent(value) {
  return `${formatCalculatorNumber(new Big(value || 0).times(100))}%`
}

// Remaining/max HP are displayed as two numbers, not evaluated as division.
export function formatCalculatorResult(value) {
  return typeof value === 'string' && value.includes('/')
    ? value.split('/').map(formatCalculatorNumber).join('/')
    : formatCalculatorNumber(value)
}
