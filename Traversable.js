// @flow
import { HKT } from './HKT'
import type { Applicative } from './Applicative'

export interface Traversable<T> {
  sequence<F, A, B>(dictApplicative: Applicative<F>, tfa: HKT<T, HKT<F, A>>): HKT<F, HKT<T, A>>
}

export function sequence<T, F, A>(dictTraversable: Traversable<T>, dictApplicative: Applicative<F>, tfa: HKT<T, HKT<F, A>>): HKT<F, HKT<T, A>> {
  return dictTraversable.sequence(dictApplicative, tfa)
}

