// @flow
import type { HKT2 } from './HKT'
import type { Functor } from './Functor'

export interface Bifunctor<F> extends Functor<F> {
  bimap<A, B, C, D>(f: (a: A) => B, g: (c: C) => D, fac: HKT2<F, A, C>): HKT2<F, B, D>
}

export function bimap<F, A, B, C, D>(dictBifunctor: Bifunctor<F>, f: (a: A) => B, g: (c: C) => D, fac: HKT2<F, A, C>): HKT2<F, B, D> {
  return dictBifunctor.bimap(f, g, fac)
}
