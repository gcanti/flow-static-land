// @flow

/*

  Porting of purescript-aff https://github.com/slamdata/purescript-aff

*/

import { HKT } from './HKT'
import type { HKT2 } from './HKT'
import type { Monad } from './Monad'
import type { Eff } from './Eff'
import { EXCEPTION, throwException } from './Exception'
import { constant } from './Fun'

import * as eff from './Eff'

class IsAff {}

export type ErrorHandler<E> = (e: Error) => Eff<E, void>;

export type SuccessHandler<E, A> = (a: A) => Eff<E, void>;

// An asynchronous computation with effects `e`. The computation either
// errors or produces a value of type `a`.
export type AffV<E, A> = (s: (a: A) => void, e: (e: Error) => void) => Canceler<E>;

export type Aff<E, A> = HKT2<IsAff, E, A>;

// A pure asynchronous computation, having no effects other than
// asynchronous computation.
export type PureAff<A> = Aff<{}, A>;

// A canceler is an asynchronous function that can be used to attempt the
// cancelation of a computation. Returns a boolean flag indicating whether
// or not the cancellation was successful. Many computations may be composite,
// in such cases the flag indicates whether any part of the computation was
// successfully canceled. The flag should not be used for communication.
export type Canceler<E> = (e: Error) => Aff<E, boolean>;

export function prj<E, A>(aff: Aff<E, A>): AffV<E, A> {
  return ((aff: any): AffV<E, A>)
}

export function inj<E, A>(affv: AffV<E, A>): Aff<E, A> {
  return ((affv: any): Aff<E, A>)
}

// Runs the asynchronous computation. You must supply an error callback and a
// success callback.
export function runAff<EE, ES, EA, A>(
  error: (e: Error) => Eff<EE, void>, // <= do not use ErrorHandler type here
  success: (a: A) => Eff<ES, void>,   // <= do not use SuccessHandler type here
  aff: Aff<EA, A>): Eff<EE & ES, Canceler<EA>> {
  return eff.inj(() => prj(aff)(a => { eff.runEff(success(a)) }, e => { eff.runEff(error(e)) }))
}

// A constant canceler that always returns false.
export function nonCanceler<E>(): Canceler<E> {
  return constant(of(false))
}

// A constant canceller that always returns true.
export function alwaysCanceler<E>(): Canceler<E> {
  return constant(of(true))
}

// Converts the asynchronous computation into a synchronous one. All values
// are ignored, and if the computation produces an error, it is thrown.
//
// Catching exceptions by using `catchException` with the resulting Eff
// computation is not recommended, as exceptions may end up being thrown
// asynchronously, in which case they cannot be caught.
//
// If you do need to handle exceptions, you can use `runAff` instead
export function launchAff<E, A> (aff: Aff<E, A>): Eff<{ err: EXCEPTION }, Canceler<E>> {
  return runAff(throwException, constant(eff.of(undefined)), aff)
}

export function map<E, A, B>(f: (a: A) => B, fa: Aff<E, A>): Aff<E, B> {
  return inj((success, error) => {
    return prj(fa)(a => success(f(a)), error)
  })
}

export function ap<E1, E2, E: E1 & E2, A, B>(fab: Aff<E1, (a: A) => B>, fa: Aff<E2, A>): Aff<E, B> {
  return chain(f => map(f, fa), fab) // <= derived
}

export function of<E, A>(a: A): Aff<E, A> {
  return inj((success) => {
    success(a)
    return nonCanceler()
  })
}

export function chain<E1, E2, E: E1 & E2, A, B>(f: (a: A) => Aff<E1, B>, fa: Aff<E2, A>): Aff<E, B> {
  return inj((success, error) => {
    let isCanceled = false
    let requestCancel = false
    let onCanceler = (canceler) => {} // eslint-disable-line no-unused-vars
    let canceler2: ?Canceler<any> = null

    const canceler1: Canceler<E2> = prj(fa)(v => {
      if (requestCancel) {
        isCanceled = true
      } else {
        canceler2 = prj(f(v))(success, error)
        onCanceler(canceler2)
      }
    }, error)

    return (e: Error): Aff<E, boolean> => {
      return inj((s, f) => {
        requestCancel = true
        if (canceler2 != null) {
          return prj(canceler2(e))(s, f)
        } else {
          return prj(canceler1(e))(bool => {
            if (bool || isCanceled) {
              s(true)
            } else {
              onCanceler = canceler => {
                prj(canceler(e))(s, f)
              }
            }
          }, f)
        }
      })
    }
  })
}

if (false) { // eslint-disable-line
  ({
    map,
    ap,
    of,
    chain
  }: Monad<HKT<IsAff, *>>)
}
