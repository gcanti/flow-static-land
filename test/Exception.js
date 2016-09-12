// @flow

declare var describe: Function;
declare var it: Function;

import assert from 'assert'
import type { Eff } from '../src/Eff'
import { runEff, of } from '../src/Eff'
import {
  EXCEPTION,
  error,
  throwException,
  catchException,
  tryEff
} from '../src/Exception'
import type { Either } from '../src/Either'
import { Left } from '../src/Either'

describe('Exception', () => {

  const eff: Eff<{ err: EXCEPTION }, string> = throwException(error('ouch!'))

  it('throwException', () => {
    assert.throws(() => {
      runEff(eff)
    })
  })

  it('catchException', () => {
    const catched: Eff<{}, string> = catchException(() => of('ok'), eff)
    assert.strictEqual(runEff(catched), 'ok')
  })

  it('tryEff', () => {
    const eitherEff: Eff<{}, Either<Error, string>> = tryEff(eff)
    assert.ok(runEff(eitherEff) instanceof Left)
  })

})
