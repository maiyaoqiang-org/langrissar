import test from 'node:test'
import assert from 'node:assert/strict'
import { analyzeCalculatorFormula as analyze } from '../src/common/calculator-formula.mjs'

test('valid arithmetic retains decimals, negatives and percentage input units', () => {
  assert.equal(analyze('20+5+8').value, 33)
  assert.equal(analyze('1588/1.2*(1+0.2+0.3)*1.4').value, 2779)
  assert.equal(analyze('-20').value, -20)
  assert.equal(analyze('(.5+1.5)/2').value, 1)
  assert.equal(analyze('0').value, 0)
  assert.equal(analyze('', 1).value, 1)
})
test('unfinished and invalid input never supply a replacement calculation value', () => {
  for (const input of ['1000+', '(20+5', '-', '1.']) {
    assert.equal(analyze(input).state, 'incomplete', input)
    assert.equal(analyze(input).value, undefined)
  }
  for (const input of ['1/0', '0/0', '20+)', '2//3', 'abc', '20%']) {
    assert.equal(analyze(input).state, 'invalid', input)
    assert.equal(analyze(input).value, undefined)
  }
})
