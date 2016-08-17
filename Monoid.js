// @flow
import type { Semigroup } from './Semigroup'

export interface Monoid<S> extends Semigroup<S> {
  empty(): S
}

export function concat<S>(dictSemigroup: Semigroup<S>, a: S, b: S): S {
  return dictSemigroup.concat(a, b)
}
