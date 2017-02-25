// @flow

declare var describe: Function;
declare var it: Function;

import assert from 'assert'
import {
  compose,
  pipe,
  curry
} from '../src/Fun'

const f = (n: number) => n + 1
const g = (n: number) => n * 2

describe('Fun', () => {

  it('compose', () => {
    assert.strictEqual(compose(f, g)(2), 5)
    assert.strictEqual(compose(f, g, f)(2), 7)
    assert.strictEqual(compose(f, g, f, g)(2), 11)
    assert.strictEqual(compose(f, g, f, g, f)(2), 15)
    assert.strictEqual(compose(f, g, f, g, f, g)(2), 23)
    assert.strictEqual(compose(f, g, f, g, f, g, f)(2), 31)
    assert.strictEqual(compose(f, g, f, g, f, g, f, g)(2), 47)
    assert.strictEqual(compose(f, g, f, g, f, g, f, g, f)(2), 63)
  })

  it('pipe', () => {
    assert.strictEqual(pipe(f, g)(2), 6)
    assert.strictEqual(pipe(f, g, f)(2), 7)
    assert.strictEqual(pipe(f, g, f, g)(2), 14)
    assert.strictEqual(pipe(f, g, f, g, f)(2), 15)
    assert.strictEqual(pipe(f, g, f, g, f, g)(2), 30)
    assert.strictEqual(pipe(f, g, f, g, f, g, f)(2), 31)
    assert.strictEqual(pipe(f, g, f, g, f, g, f, g)(2), 62)
    assert.strictEqual(pipe(f, g, f, g, f, g, f, g, f)(2), 63)
  })

  it('curry', () => {
    const h = curry((a: number, b: number, c: number): number => a + b + c)
    assert.strictEqual(h(1)(2)(3), 6)
    assert.strictEqual(h(1)(2, 3), 6)
    assert.strictEqual(h(1, 2)(3), 6)
    assert.strictEqual(h(1, 2, 3), 6)
    const hh = curry((a: number, b: number, c: number, d: number, e: number): number => a + b + c + d + e)
    assert.strictEqual(hh(1)(2)(3)(4)(5), 15)
    assert.strictEqual(hh(1)(2, 3)(4)(5), 15)
    const snoc = (as: Array<number>, a: number) => as.concat(a)
    assert.deepEqual(curry(snoc)([1, 2, 3])(4), [1, 2, 3, 4])
  })

})
