// @flow

declare var describe: Function;
declare var it: Function;

import assert from 'assert'
import {
  of,
  chainRec
} from '../src/Identity'
import * as either from '../src/Either'

describe('Identity', () => {

  it('chainRec', () => {
    const result = chainRec(n => {
      if (n === 0) {
        return of(either.right('done'))
      }
      return of(either.left(n - 1))
    }, 10000)
    assert.strictEqual(result, 'done')
  })

})
