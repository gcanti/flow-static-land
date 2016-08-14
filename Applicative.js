// @flow
import { HKT } from './HKT'
import type { Apply } from './Apply'

export interface Applicative<F, A, B> extends Apply<F, A, B> {
  of(a: A): HKT<F, A>
}

export function of<F, A, B>(applicative: Applicative<F, A, B>, a: A): HKT<F, A> {
  return applicative.of(a)
}
