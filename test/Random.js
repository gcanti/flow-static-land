// @flow

declare var describe: Function;
declare var it: Function;

import assert from 'assert'
import { runEff } from '../src/Eff'
import {
  randomInt,
  randomRange,
  randomBool
} from '../src/Random'

describe('Random', () => {

  it('randomInt', () => {
    const eff = randomInt(10, 20)
    for (let i = 0; i < 1000; i++) {
      const n = runEff(eff)
      assert.ok(n >= 10 && n <= 20)
    }
  })

  it('randomRange', () => {
    const eff = randomRange(10, 20)
    for (let i = 0; i < 1000; i++) {
      const n = runEff(eff)
      assert.ok(n >= 10 && n < 20)
    }
  })

  it('randomBool', () => {
    const b = runEff(randomBool())
    assert.ok(b === true || b === false)
  })

})
