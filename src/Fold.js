// @flow
import type { Monoid } from './Monoid'
import type { Maybe } from './Maybe'

import { arrayMonoid } from './Monoid'
import { id } from './Identity'
import { first, of, Nothing } from './Maybe'

export interface Fold<S, A> {
  /**
   * map each target to a Monoid and combine the results
   * underlying representation of [[Fold]], all [[Fold]] methods are defined in terms of foldMap
   */
  foldMap<M>(monoid: Monoid<M>, f: (a: A) => M, s: S): M
}

/** combine all targets using a target's Monoid */
export function fold<S, A>(fold: Fold<S, A>, monoid: Monoid<A>, s: S): A {
  return fold.foldMap(monoid, id, s)
}

/**
 * get all the targets of a [[Fold]]
 */
export function getAll<S, A>(fold: Fold<S, A>, s: S): Array<A> {
  return fold.foldMap(arrayMonoid, a => [a], s)
}

/** find the first target of a [[Fold]] matching the predicate  */
export function find<S, A>(fold: Fold<S, A>, p: (a: A) => boolean, s: S): Maybe<A> {
  return fold.foldMap(first, a => p(a) ? of(a) : Nothing, s)
}

/** get the first target of a [[Fold]] */
export function headOption<S, A>(fold: Fold<S, A>, s: S): Maybe<A> {
  return find(fold, () => true, s)
}
