// @flow
import { HKT } from './HKT'
import type { Functor } from './Functor'
import type { Foldable } from './Foldable'
import type { Applicative } from './Applicative'

// `Traversable` represents data structures which can be _traversed_,
// accumulating results and effects in some `Applicative` functor.
//
// - `traverse` runs an action for every element in a data structure,
//   and accumulates the results.
// - `sequence` runs the actions _contained_ in a data structure,
//   and accumulates the results.
export interface Traversable<T> extends Functor<T>, Foldable<T> {
  sequence<F, A>(applicative: Applicative<F>, tfa: HKT<T, HKT<F, A>>): HKT<F, HKT<T, A>>
}

export function traverse<F, T, A, B>(
  applicative: Applicative<F>,
  traversable: Traversable<T>,
  f: (a: A) => HKT<F, B>,
  ta: HKT<T, A>): HKT<F, HKT<T, B>> {
  return traversable.sequence(applicative, traversable.map(f, ta))
}
