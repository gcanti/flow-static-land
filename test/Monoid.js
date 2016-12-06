// @flow

declare var describe: Function;
declare var it: Function;

import assert from 'assert'
import {
  sum,
  stringMonoid,
  getProductMonoid
} from '../src/Monoid'

describe('Monoid', () => {

  it('getProductMonoid', () => {
    const monoid = getProductMonoid(stringMonoid, sum)
    assert.deepEqual(monoid.concat(['a', 2], ['b', 3]), ['ab', 5])
  })

})
