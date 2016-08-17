// @flow
import { HKT } from './HKT'
import type { Apply } from './Apply'

export interface Applicative<F> extends Apply<F> {
  of<A>(a: A): HKT<F, A>
}

export function of<F, A>(dictApplicative: Applicative<F>, a: A): HKT<F, A> {
  return dictApplicative.of(a)
}
