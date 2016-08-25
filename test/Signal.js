// @flow

declare var describe: Function;
declare var it: Function;

import assert from 'assert'
import type { Signal } from '../Signal'
import {
  prj,
  of,
  map,
  ap,
  foldp,
  concat,
  sampleOn,
  dropRepeats,
  filter
} from '../Signal'

function next<A>(fa: Signal<A>, a: A): void {
  prj(fa).set(a)
}

function assertEvents<A>(fa: Signal<A>) {
  const sa = prj(fa)
  const events: Array<A> = []
  sa.subscribe(a => events.push(a))
  return as => assert.deepEqual(events, as)
}

describe('Signal', () => {

  it('of', () => {
    const s: Signal<number> = of(1)
    const deepEqual1 = assertEvents(s)
    deepEqual1([1])
    next(s, 2)
    const deepEqual2 = assertEvents(s)
    deepEqual1([1, 2])
    deepEqual2([2])
  })

  it('map', () => {
    const s: Signal<string> = of('hello')
    const sm: Signal<number> = map(s => s.length, s)
    const deepEqual = assertEvents(sm)
    next(s, 'world')
    deepEqual([5, 5])
  })

  it('ap', () => {
    const s: Signal<number> = of(1)
    const sf: Signal<(n: number) => number> = of(n => n + 1)
    const sa: Signal<number> = ap(sf, s)
    const deepEqual = assertEvents(sa)
    deepEqual([2])
    next(sf, n => n + 2)
    deepEqual([2, 3])
    next(s, 10)
    deepEqual([2, 3, 12])
  })

  it('foldp', () => {
    const s: Signal<number> = of(1)
    const sf: Signal<number> = foldp((a, b) => a + b, 0, s)
    const deepEqual = assertEvents(sf)
    deepEqual([1])
    next(s, 2)
    deepEqual([1, 3])
    assertEvents(sf)([3])
  })

  it('concat', () => {
    const s1: Signal<number> = of(1)
    const s2: Signal<number> = of(2)
    const s3: Signal<number> = concat(s1, s2)
    const deepEqual = assertEvents(s3)
    deepEqual([1])
    next(s1, 3)
    next(s2, 4)
    next(s2, 5)
    next(s1, 6)
    deepEqual([1, 3, 4, 5, 6])
  })

  it('sampleOn', () => {
    const s1: Signal<string> = of('a')
    const s2: Signal<number> = of(1)
    const s3: Signal<number> = sampleOn(s1, s2)
    const deepEqual = assertEvents(s3)
    deepEqual([1])
    next(s1, 'b')
    next(s2, 2)
    next(s1, 'c')
    deepEqual([1, 1, 2])
  })

  it('dropRepeats', () => {
    const s: Signal<number> = of(1)
    const duc: Signal<number> = dropRepeats({ equals: (a, b) => a === b }, s)
    const deepEqual = assertEvents(duc)
    deepEqual([1])
    next(s, 2)
    next(s, 2)
    next(s, 3)
    deepEqual([1, 2, 3])
  })

  it('filter', () => {
    const s: Signal<number> = of(2)
    const isEven = n => n % 2 === 0
    const fs: Signal<number> = filter(isEven, 0, s)
    const deepEqual = assertEvents(fs)
    deepEqual([2])
    next(s, 4)
    next(s, 6)
    next(s, 3)
    deepEqual([2, 4, 6])

    const s2: Signal<number> = of(1)
    const fs2: Signal<number> = filter(isEven, 0, s2)
    assertEvents(fs2)([0])
  })

})
