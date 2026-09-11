import test from 'node:test'
import assert from 'node:assert/strict'
import { analyzeCalculatorFormula } from '../src/common/calculator-formula.mjs'
import { formatCalculatorNumber as number, formatCalculatorPercent as percent, formatCalculatorResult as result } from '../src/common/calculator-display.mjs'

test('long fractions and floating-point tails display at most two decimals', () => {
  const value = analyzeCalculatorFormula('2200/1.3*1.5*1.5').value
  assert.equal(number(value), '3807.69')
  assert.equal(value, 2200 / 1.3 * 1.5 * 1.5)
  assert.equal(number(258923.07692307688), '258923.08')
  assert.equal(number(336599.99999999994), '336600')
  assert.equal(number(1.005), '1.01')
  assert.equal(number(-1.005), '-1.01')
  assert.equal(number(-0.004), '0')
})

test('integers and shorter decimals retain their existing display', () => {
  for (const [input, expected] of [[80, '80'], [1.3, '1.3'], ['1.2300', '1.23'], [0, '0'], ['兵打兵', '兵打兵'], [null, '']]) {
    assert.equal(number(input), expected)
  }
  assert.equal(percent(0.123456), '12.35%')
  assert.equal(percent(0.7), '70%')
  assert.equal(result('12.3456/100.6789'), '12.35/100.68')
  assert.equal(result('0/100'), '0/100')
})
