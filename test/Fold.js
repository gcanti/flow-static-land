// @flow

declare var describe: Function;
declare var it: Function;

import assert from 'assert'
import type { Fold } from '../src/Fold'
import type { Monoid } from '../src/Monoid'
import {
  concatAll,
  stringMonoid
} from '../src/Monoid'
import {
  fold,
  getAll,
  find,
  headOption,
  exist,
  all,
  choice,
  composeFold
} from '../src/Fold'
import * as either from '../src/Either'

function split(s: string): Array<string> {
  var rest = s
  const ret = []
  while (rest.length > 0) {
    ret.push(rest.substring(0, 2))
    rest = rest.substring(2)
  }
  return ret
}

const f: Fold<string, string> = {
  foldMap<M>(monoid: Monoid<M>, f: (s: string) => M, s: string): M {
    return concatAll(monoid, split(s).map(f))
  }
}
const g: Fold<string, string> = {
  foldMap<M>(monoid: Monoid<M>, f: (s: string) => M, s: string): M {
    return concatAll(monoid, s.split('').slice(0, 1).map(f))
  }
}

describe('Fold', () => {

  it('foldMap', () => {
    assert.strictEqual(f.foldMap(stringMonoid, s => s + '-', 'hello'), 'he-ll-o-')
  })

  it('fold', () => {
    assert.strictEqual(fold(f, stringMonoid, 'hello'), 'hello')
  })

  it('getAll', () => {
    assert.deepEqual(getAll(f, 'hello'), ['he', 'll', 'o'])
  })

  it('find', () => {
    assert.strictEqual(find(f, () => true, 'hello'), 'he')
    assert.strictEqual(find(f, s => s.length < 2, 'hello'), 'o')
    assert.strictEqual(find(f, () => false, 'hello'), null)
  })

  it('headOption', () => {
    assert.strictEqual(headOption(f, 'hello'), 'he')
    assert.strictEqual(headOption(f, ''), null)
  })

  it('any', () => {
    assert.strictEqual(exist(f, c => c.toUpperCase() === c, 'HEllo'), true)
    assert.strictEqual(exist(f, c => c.toUpperCase() === c, 'Hello'), false)
  })

  it('all', () => {
    assert.strictEqual(all(f, c => c.toUpperCase() === c, 'HELLO'), true)
    assert.strictEqual(all(f, c => c.toUpperCase() === c, 'HELLo'), false)
  })

  it('choice', () => {
    assert.strictEqual(choice(f, g).foldMap(stringMonoid, s => s + '-', either.left('hello')), 'he-ll-o-')
    assert.strictEqual(choice(f, g).foldMap(stringMonoid, s => s + '-', either.right('hello')), 'h-')
  })

  it('composeFold', () => {
    assert.strictEqual(composeFold(g, f).foldMap(stringMonoid, s => s + '-', 'hello'), 'h-l-o-')
  })

})
