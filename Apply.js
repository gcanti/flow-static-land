// @flow
import { HKT } from './HKT'
import type { Functor } from './Functor'

export interface Apply<F, A, B> extends Functor<F, A, B> {
  ap(fab: HKT<F, (a: A) => B>, fa: HKT<F, A>): HKT<F, B>
}

export function ap<F, A, B>(apply: Apply<F, A, B>, fab: HKT<F, (a: A) => B>, fa: HKT<F, A>): HKT<F, B> {
  return apply.ap(fab, fa)
}
