// @flow

declare var describe: Function;
declare var it: Function;

import assert from 'assert'
import type { Eff } from '../Eff'
import { runEff, of } from '../Eff'
import {
  EXCEPTION,
  error,
  throwException,
  catchException,
  tryEff
} from '../Exception'
import type { Either } from '../Either'
import { Left } from '../Either'

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
