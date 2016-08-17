// @flow
import { HKT } from './HKT'
import type { Functor } from './Functor'

export interface Apply<F> extends Functor<F> {
  ap<A, B>(fab: HKT<F, (a: A) => B>, fa: HKT<F, A>): HKT<F, B>
}

export function ap<F, A, B>(dictApply: Apply<F>, fab: HKT<F, (a: A) => B>, fa: HKT<F, A>): HKT<F, B> {
  return dictApply.ap(fab, fa)
}
