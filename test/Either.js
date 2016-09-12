// @flow

declare var describe: Function;
declare var it: Function;

import assert from 'assert'
import {
  right,
  left,
  fromRight,
  fromLeft,
  map,
  either
} from '../src/Either'

describe('Either', () => {

  it('map', () => {
    const f = (s: string): number => s.length
    assert.strictEqual(fromRight(map(f, right('s'))), 1)
    assert.strictEqual(fromLeft(map(f, left('s'))), 's')
  })

  it('either', () => {
    const f = () => 'left'
    const g = () => 'right'
    assert.strictEqual(either(f, g, right(1)), 'right')
    assert.strictEqual(either(f, g, left('s')), 'left')
  })

})
