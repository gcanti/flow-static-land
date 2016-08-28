// @flow

declare var describe: Function;
declare var it: Function;

import assert from 'assert'
import {
  Nothing,
  of,
  maybe,
  fromMaybe,
  getMonoidMaybe
} from '../Maybe'

describe('Maybe', () => {

  it('maybe', () => {
    const f = (s: string): number => s.length
    assert.strictEqual(maybe(1, f, Nothing), 1)
    assert.strictEqual(maybe(1, f, of('abc')), 3)
  })

  it('fromMaybe', () => {
    assert.strictEqual(fromMaybe(1, Nothing), 1)
    assert.strictEqual(fromMaybe(1, of(2)), 2)
  })

  it('concat', () => {
    const { concat } = getMonoidMaybe({ concat(x, y){ return x + y } })
    assert.strictEqual(concat(Nothing, of(1)), 1)
    assert.strictEqual(concat(of(2), Nothing), 2)
    assert.strictEqual(concat(of(2), of(1)), 3)
  })

})
