// @flow
import type { Semigroup } from './Semigroup'

export interface Monoid<S> extends Semigroup<S> {
  empty(): S
}

export function concat<S>(semigroup: Semigroup<S>, a: S, b: S): S {
  return semigroup.concat(a, b)
}
