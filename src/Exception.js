// @flow
import type { Eff } from './Eff'
import { inj, runEff, map, of } from './Eff'
import type { Either } from './Either'
import { left, right } from './Either'

// This effect is used to annotate code which possibly throws exceptions
export class EXCEPTION {}

export function error(message: string): Error {
  return new Error(message)
}

// Throw an exception
export function throwException<E, A>(e: Error): Eff<{ err: EXCEPTION } & E, A> {
  return inj(() => { throw e })
}

export type ErrorHandler<E, A> = (e: Error) => Eff<E, A>;

// Catch an exception by providing an exception handler
export function catchException<E: Object, A>(handler: ErrorHandler<E, A>, eff: Eff<{ err: EXCEPTION } & E, A>): Eff<E, A> {
  return inj(() => {
    try {
      return runEff(eff)
    } catch (e) {
      return runEff(handler(e))
    }
  })
}

// Runs an Eff and returns eventual Exceptions as a `Left` value. If the
// computation succeeds the result gets wrapped in a `Right`.
export function tryEff<E: Object, A>(eff: Eff<{ err: EXCEPTION } & E, A>): Eff<E, Either<Error, A>> {
  const handler = e => of(left(e))
  return catchException(handler, map(right, eff))
}
