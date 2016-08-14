// @flow
import { HKT } from './HKT'
import type { Applicative } from './Applicative'

export interface Traversable<T, A, B, F> {
  sequence(f: Applicative<F, A, B>, tfa: HKT<T, HKT<F, A>>): HKT<F, HKT<T, A>>
}

export function sequence<T, A, B, F>(traversable: Traversable<T, A, B, F>, f: Applicative<F, A, B>, tfa: HKT<T, HKT<F, A>>): HKT<F, HKT<T, A>> {
  return traversable.sequence(f, tfa)
}

