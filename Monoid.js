// @flow
import type { Semigroup } from './Semigroup'

export interface Monoid<S> extends Semigroup<S> {
  empty(): S
}
