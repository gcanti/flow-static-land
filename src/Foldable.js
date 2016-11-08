// @flow
import type { Monoid } from './Monoid'

import { HKT } from './HKT'

/*

  `Foldable` represents data structures which can be _folded_.

  - `foldr` folds a structure from the right (not implemented)
  - `foldl` folds a structure from the left
  - `foldMap` folds a structure by accumulating values in a `Monoid`

  reduce = foldl

*/

export interface Foldable<F> {
  reduce<A, B>(f: (b: B, a: A) => B, b: B, fa: HKT<F, A>): B
}

/* A default implementation of `foldMap` using `foldl`. */
export function foldMap<F, M, A>(foldable: Foldable<F>, monoid: Monoid<M>, f: (a: A) => M, fa: HKT<F, A>): M {
  return foldable.reduce((acc, x) => monoid.concat(f(x), acc), monoid.empty(), fa)
}
