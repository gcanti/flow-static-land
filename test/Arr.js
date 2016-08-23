// @flow
import * as arr from '../Arr'
import * as maybe from '../Maybe'
import assert from 'assert'
import { ordNumber } from '../Ord'

declare var describe: Function;
declare var it: Function;

describe('Arr', () => {

  const as = arr.inj([1, 2, 3])
  const empty = arr.empty()

  it('isEmpty', () => {
    assert.strictEqual(arr.isEmpty(as), false)
    assert.strictEqual(arr.isEmpty(empty), true)
  })

  it('length', () => {
    assert.strictEqual(arr.length(as), 3)
    assert.strictEqual(arr.length(empty), 0)
  })

  it('index', () => {
    assert.strictEqual(arr.index(as, 1), 2)
  })

  it('cons', () => {
    assert.deepEqual(arr.cons(0, as), [0, 1, 2, 3])
  })

  it('snoc', () => {
    assert.deepEqual(arr.snoc(as, 4), [1, 2, 3, 4])
  })

  it('head', () => {
    assert.strictEqual(arr.head(as), 1)
  })

  it('last', () => {
    assert.strictEqual(arr.last(as), 3)
  })

  it('tail', () => {
    assert.strictEqual(arr.tail(empty), maybe.Nothing)
    assert.deepEqual(arr.tail(as), [2, 3])
  })

  it('take', () => {
    assert.deepEqual(arr.take(2, empty), [])
    assert.deepEqual(arr.take(2, as), [1, 2])
  })

  it('takeWhile', () => {
    assert.deepEqual(arr.takeWhile((n) => n % 2 == 0, as), [2])
  })

  it('drop', () => {
    assert.deepEqual(arr.drop(2, as), [3])
  })

  it('dropWhile', () => {
    assert.deepEqual(arr.dropWhile((n) => n % 2 == 0, as), [1, 3])
  })

  it('init', () => {
    assert.strictEqual(arr.init(empty), maybe.Nothing)
    assert.deepEqual(arr.init(as), [1, 2])
  })

  it('slice', () => {
    assert.deepEqual(arr.slice(1, 2, as), arr.inj([2]))
  })

  it('findIndex', () => {
    assert.strictEqual(arr.findIndex((x) => x === 2, empty), maybe.Nothing)
    assert.strictEqual(arr.findIndex((x) => x === 2, as), 1)
  })

  it('insertAt', () => {
    assert.strictEqual(arr.insertAt(1, 1, empty), maybe.Nothing)
    assert.deepEqual(arr.insertAt(0, 1, empty), [1])
  })

  it('updateAt', () => {
    assert.strictEqual(arr.updateAt(1, 1, empty), maybe.Nothing)
    assert.deepEqual(arr.updateAt(1, 1, as), [1, 1, 3])
  })

  it('deleteAt', () => {
    assert.strictEqual(arr.deleteAt(1, empty), maybe.Nothing)
    assert.deepEqual(arr.deleteAt(0, as), [2, 3])
  })

  it('modifyAt', () => {
    assert.strictEqual(arr.modifyAt(1, x => 2 * x, empty), maybe.Nothing)
    assert.deepEqual(arr.modifyAt(1, x => 2 * x, as), [1, 4, 3])
  })

  it('mapMaybe', () => {
    const f = (a) => a % 2 === 0 ? maybe.Nothing : maybe.of(a)
    assert.deepEqual(arr.mapMaybe(f, as), [1, 3])
  })

  it('catMaybes', () => {
    assert.deepEqual(arr.catMaybes(arr.inj([maybe.of(1), maybe.of(2), maybe.of(3)])), [1, 2, 3])
    assert.deepEqual(arr.catMaybes(arr.inj([maybe.of(1), maybe.Nothing, maybe.of(3)])), [1, 3])
  })

  it('sort', () => {
    assert.deepEqual(arr.sort(ordNumber, arr.inj([3, 2, 1])), [1, 2, 3])
  })


})
