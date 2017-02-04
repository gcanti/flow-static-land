// @flow

declare var describe: Function;
declare var it: Function;

import assert from 'assert'
import type { Prism } from '../src/PPrism'
import {
  createSSAB,
  modify
} from '../src/PPrism'
import * as either from '../src/Either'
import * as maybe from '../src/Maybe'

type Json =
  | { type: 'JNull' }
  | { type: 'JStr', v: string }
  | { type: 'JNum', v: number }
  | { type: 'JObj', v: { [key: string]: Json } }
  ;

const jStr: Prism<Json, string> = createSSAB(
  s => s.type === 'JStr' ? maybe.of(s.v) : maybe.Nothing,
  a => ({ type: 'JStr', v: a })
)

function isLongString(json: Json): boolean {
  return either.either(
    () => false,
    r => r.length > 10,
    jStr.getOrModify(json)
  )
}

describe('PPrism', () => {

  it('getOrModify', () => {
    assert.strictEqual(isLongString({ type: 'JStr', v: 'sss' }), false)
    assert.strictEqual(isLongString({ type: 'JStr', v: '0123456789sss' }), true)
  })

  it('modify', () => {
    assert.deepEqual(modify(jStr, () => 'bar', { type: 'JStr', v: 'foo' }), { type: 'JStr', v: 'bar' })
  })

})
