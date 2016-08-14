// @flow
import { HKT2 } from './HKT'
import type { Functor } from './Functor'

export interface Profunctor<F, A, B, C, D> extends Functor<F, C, D> {
  promap(f: (a: A) => B, g: (c: C) => D, fbc: HKT2<F, B, C>): HKT2<F, A, D>
}

export function promap<F, A, B, C, D>(profunctor: Profunctor<F, A, B, C, D>, f: (a: A) => B, g: (c: C) => D, fbc: HKT2<F, B, C>): HKT2<F, A, D> {
  return profunctor.promap(f, g, fbc)
}
