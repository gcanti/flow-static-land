// @flow
import { HKT } from './HKT'
import type { HKT2 } from './HKT'
import type { Functor } from './Functor'

export interface Bifunctor<F> extends Functor<HKT<F, *>> {
  bimap<A, B, C, D>(f: (a: A) => B, g: (c: C) => D, fac: HKT2<F, A, C>): HKT2<F, B, D>
}
