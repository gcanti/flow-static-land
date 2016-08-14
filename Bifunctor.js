// @flow
import { HKT2 } from './HKT'
import type { Functor } from './Functor'

export interface Bifunctor<F, A, B, C, D> extends Functor<F, C, D> {
  bimap(f: (a: A) => B, g: (c: C) => D, fac: HKT2<F, A, C>): HKT2<F, B, D>
}

export function bimap<F, A, B, C, D>(bifunctor: Bifunctor<F, A, B, C, D>, f: (a: A) => B, g: (c: C) => D, fac: HKT2<F, A, C>): HKT2<F, B, D> {
  return bifunctor.bimap(f, g, fac)
}
