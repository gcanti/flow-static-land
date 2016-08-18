// @flow
import type { Semigroup } from './Semigroup'

export interface Monoid<A> extends Semigroup<A> {
  empty(): A
}
