// @flow

declare var describe: Function;
declare var it: Function;

import assert from 'assert'
import {
  of,
  map,
  ap,
  chain,
  getMonoid,
  runIO
} from '../src/IO'
import {
  stringMonoid
} from '../src/Monoid'

describe('IO', () => {

  it('map', () => {
    const aIO = of('a')
    assert.strictEqual(runIO(map(s => s.length, aIO)), 1)
  })

  it('ap', () => {
    const aIO = of('a')
    const fIO = of(s => s.length)
    assert.strictEqual(runIO(ap(fIO, aIO)), 1)
  })

  it('chain', () => {
    const aIO = of('a')
    assert.strictEqual(runIO(chain(s => of(s.length), aIO)), 1)
  })

  it('concat', () => {
    const aIO = of('a')
    const bIO = of('b')
    const { concat } = getMonoid(stringMonoid)
    assert.strictEqual(runIO(concat(aIO, bIO)), 'ab')
  })

})
