// @flow
import { HKT } from './HKT'
import type { Functor } from './Functor'
import type { Foldable } from './Foldable'
import type { Applicative } from './Applicative'

export interface Traversable<T> extends Functor<T>, Foldable<T> {
  sequence<F, A>(applicative: Applicative<F>, tfa: HKT<T, HKT<F, A>>): HKT<F, HKT<T, A>>
}
