// @flow
import { HKT } from './HKT'
import type { HKT2 } from './HKT'
import type { Functor } from './Functor'

import { compose } from './Fun'
import { id } from './Identity'

/*

  The Yoneda `Functor`

  `Yoneda f` is a `Functor` for any type constructor `f`.

  Implementation based on the purescript-free package (https://github.com/purescript/purescript-free)

*/

class IsYoneda {}

export type YonedaV<F, A> = <B>(f: (a: A) => B) => HKT<F, B>;
export type Yoneda<F, A> = HKT2<IsYoneda, F, A>;
export type YonedaF = HKT<IsYoneda, *>;

export function inj<F, A>(a: YonedaV<F, A>): Yoneda<F, A> {
  return ((a: any): Yoneda<F, A>)
}

export function prj<F, A>(fa: Yoneda<F, A>): YonedaV<F, A> {
  return ((fa: any): YonedaV<F, A>)
}

/* Run a computation of type `Yoneda f a`. */
export function runYoneda<F, A, B>(y: Yoneda<F, A>, f: (a: A) => B): HKT<F, B> {
  return prj(y)(f)
}

/* Lift a value described by the `Functor` `f` to the `Functor` `Yoneda f`. */
export function liftYoneda<F, A>(functor: Functor<F>, fa: HKT<F, A>): Yoneda<F, A> {
  return inj(function <B>(k: (a: A) => B): HKT<F, B> {
    return functor.map(k, fa)
  })
}

/* Lower a value of type `Yoneda f a` to the type constructor `f`. */
export function lowerYoneda<F, A>(y: Yoneda<F, A>): HKT<F, A> {
  return runYoneda(y, id)
}

export function map<F, A, B>(f: (a: A) => B, y: Yoneda<F, A>): Yoneda<F, B> {
  return inj(function <C>(k: (b: B) => C): HKT<F, C> {
    return runYoneda(y, compose(k, f))
  })
}

if (false) { // eslint-disable-line
  ({
    map
  }: Functor<YonedaF>)
}
