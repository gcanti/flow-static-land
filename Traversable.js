// @flow
import { HKT } from './HKT'
import type { Applicative } from './Applicative'

export interface Traversable<T> {
  sequence<F, A>(applicative: Applicative<F>, tfa: HKT<T, HKT<F, A>>): HKT<F, HKT<T, A>>
}
