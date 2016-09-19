// @flow
import { HKT } from './HKT'
import type { Functor } from './Functor'
import type { Foldable } from './Foldable'
import type { Applicative } from './Applicative'

import { id } from './Identity'

// `Traversable` represents data structures which can be _traversed_,
// accumulating results and effects in some `Applicative` functor.
//
// - `traverse` runs an action for every element in a data structure,
//   and accumulates the results.
// - `sequence` runs the actions _contained_ in a data structure,
//   and accumulates the results.
export interface Traversable<T> extends Functor<T>, Foldable<T> {
  traverse<F, A, B>(applicative: Applicative<F>, f: (a: A) => HKT<F, B>, ta: HKT<T, A>): HKT<F, HKT<T, B>>;
}

export function sequence<F, T, A>(
  applicative: Applicative<F>,
  traversable: Traversable<T>,
  tfa: HKT<T, HKT<F, A>>): HKT<F, HKT<T, A>> {
  return traversable.traverse(applicative, id, tfa)
}
