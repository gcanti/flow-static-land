// @flow
import * as assert from 'assert'
import {
  put,
  get,
  modify,
  gets,
  inj,
  runState,
  map,
  chain
} from '../src/State'
import * as tuple from '../src/Tuple'

declare var describe: Function;
declare var it: Function;

describe('State', () => {
  it('put', () => {
    assert.deepEqual(runState(put(2), 1), [undefined, 2])
  })

  it('get', () => {
    assert.deepEqual(runState(get(), 1), [1, 1])
  })

  it('modify', () => {
    const double = (n: number) => n * 2
    assert.deepEqual(runState(modify(double), 1), [undefined, 2])
  })

  it('gets', () => {
    const double = (n: number) => n * 2
    assert.deepEqual(runState(gets(double), 1), [2, 1])
  })

  it('map', () => {
    const double = (n: number) => n * 2
    const state = inj(s => tuple.inj([s - 1, s + 1]))
    assert.deepEqual(runState(map(double, state), 0), [-2, 1])
  })

  it('chain', () => {
    const f = () => inj(s => tuple.inj([s - 1, s + 1]))
    const state = inj(s => tuple.inj([s - 1, s + 1]))
    assert.deepEqual(runState(chain(f, state), 0), [0, 2])
  })
})
