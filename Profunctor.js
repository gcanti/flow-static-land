// @flow
import { HKT } from './HKT'
import type { HKT2 } from './HKT'
import type { Functor } from './Functor'

export interface Profunctor<F> extends Functor<HKT<F, *>> {
  promap<A, B, C, D>(f: (a: A) => B, g: (c: C) => D, fbc: HKT2<F, B, C>): HKT2<F, A, D>
}

export function promap<F, A, B, C, D>(dictProfunctor: Profunctor<F>, f: (a: A) => B, g: (c: C) => D, fbc: HKT2<F, B, C>): HKT2<F, A, D> {
  return dictProfunctor.promap(f, g, fbc)
}
