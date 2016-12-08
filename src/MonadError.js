// @flow
import type { Monad } from './Monad'
import type { Maybe } from './Maybe'

import { HKT } from './HKT'
import * as maybe from './Maybe'

// The `MonadError` type class represents those monads which support errors via
// `throwError` and `catchError`.
//
// - `throwError e` throws the error `e`
// - `catchError x f` calls the error handler `f` if an error is thrown during the
//   evaluation of `x`.
//
// An implementation is provided for `ErrorT`, and for other monad transformers
// defined in this library.
//
// Laws:
//
// - Left zero: `throwError e >>= f = throwError e`
// - Catch: `catchError (throwError e) f = f e`
// - Pure: `catchError (pure a) f = pure a`
//

export interface MonadError<E, M> extends Monad<M> {
  throwError<A>(e: E): HKT<M, A>,
  catchError<A>(ma: HKT<M, A>, handler: (e: E) => HKT<M, A>): HKT<M, A>
}

// This function allows you to provide a predicate for selecting the
// exceptions that you're interested in, and handle only those exceptons.
// If the inner computation throws an exception, and the predicate returns
// Nothing, then the whole computation will still fail with that exception.
export function catchJust<E, M, A, B>(
    monadError: MonadError<E, M>,
    predicate: (e: E) => Maybe<B>,
    ma: HKT<M, A>,
    handler: (b: B) => HKT<M, A>
  ): HKT<M, A> {
  return monadError.catchError(ma, e => {
    const b = maybe.prj(predicate(e))
    return b == null ? monadError.throwError(e) : handler(b)
  })
}
