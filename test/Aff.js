// @flow

declare var describe: Function;
declare var it: Function;

import assert from 'assert'
import type {
  ErrorHandler,
  SuccessHandler,
  Aff,
  Canceler
} from '../Aff'
import {
  inj,
  runAff,
  nonCanceler,
  map,
  of,
  ap,
  chain
} from '../Aff'
import {
  error,
  CONSOLE
} from '../Console'
import {
  throwException,
  EXCEPTION
} from '../Exception'
import type {
  Eff
} from '../Eff'
import {
  runEff
} from '../Eff'

function testAff(aff, expected) {
  const e: ErrorHandler<{ err: EXCEPTION }> = throwException
  const s: SuccessHandler<{ console: CONSOLE }, string> = error
  const eff: Eff<{ err: EXCEPTION, console: CONSOLE }, Canceler<{}>> = runAff(e, s, aff)
  let actual = false
  const originalConsoleError = console.error // eslint-disable-line
  console.error = s => { actual = s } // eslint-disable-line
  runEff(eff)
  assert.strictEqual(actual, expected)
  console.error = originalConsoleError // eslint-disable-line
}

describe('Aff', () => {

  const aff: Aff<{}, string> = inj(s => {
    s('hello')
    return nonCanceler()
  })

  it('runAff', () => {
    testAff(aff, 'hello')
  })

  it('map', () => {
    testAff(map(s => `${s} world`, aff), 'hello world')
  })

  it('of', () => {
    testAff(of('hello'), 'hello')
  })

  it('ap', () => {
    testAff(ap(of(s => `${s} world`), of('hello')), 'hello world')
  })

  it('chain', () => {
    testAff(chain(s => of(`${s} world`), of('hello')), 'hello world')
  })

})
