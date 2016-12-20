// @flow

declare var describe: Function;
declare var it: Function;

import assert from 'assert'
import type { Fold } from '../src/Fold'
import type { Monoid } from '../src/Monoid'
import {
  fold as monoidFold,
  stringMonoid
} from '../src/Monoid'
import {
  fold,
  getAll,
  find,
  headOption
} from '../src/Fold'

const f: Fold<string, string> = {
  foldMap<M>(monoid: Monoid<M>, f: (s: string) => M, s: string): M {
    return monoidFold(monoid, s.split('').slice(0, 2).map(f))
  }
}

describe('Fold', () => {

  it('foldMap', () => {
    assert.strictEqual(f.foldMap(stringMonoid, s => s + '-', 'hello'), 'h-e-')
  })

  it('fold', () => {
    assert.strictEqual(fold(f, stringMonoid, 'hello'), 'he')
  })

  it('getAll', () => {
    assert.deepEqual(getAll(f, 'hello'), ['h', 'e'])
  })

  it('find', () => {
    assert.strictEqual(find(f, () => true, 'hello'), 'h')
    assert.strictEqual(find(f, s => s < 'h', 'hello'), 'e')
    assert.strictEqual(find(f, () => false, 'hello'), null)
  })

  it('headOption', () => {
    assert.strictEqual(headOption(f, 'hello'), 'h')
    assert.strictEqual(headOption(f, ''), null)
  })

})
