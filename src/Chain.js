// @flow
import { HKT } from './HKT'
import type { Apply } from './Apply'

export interface Chain<F> extends Apply<F> {
  chain<A, B>(f: (a: A) => HKT<F, B>, fa: HKT<F, A>): HKT<F, B>
}

// Forwards Kleisli composition.
//
// For example:
//
// ```js
// import * as arr from '../Arr'
//
// const second = a => composeKleisli(maybe, arr.tail, arr.head)
// ```
export function composeKleisli<F, A, B, C>(chain: Chain<F>, f: (a: A) => HKT<F, B>, g: (b: B) => HKT<F, C>): (a: A) => HKT<F, C> {
  return a => chain.chain(g, f(a))
}
