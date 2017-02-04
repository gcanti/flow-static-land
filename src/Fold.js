// @flow
import type { Monoid } from './Monoid'
import type { Maybe } from './Maybe'
import type { Predicate } from './Fun'
import type { Either } from './Either'
import type { Foldable } from './Foldable'

import { arrayMonoid, all as allMonoid, any } from './Monoid'
import { id } from './Identity'
import * as maybe from './Maybe'
import * as either from './Either'
import { HKT } from './HKT'
import * as foldable from './Foldable'

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
export function find<S, A>(fold: Fold<S, A>, p: Predicate<A>, s: S): Maybe<A> {
  return fold.foldMap(maybe.first, a => p(a) ? maybe.of(a) : maybe.Nothing, s)
}

/** get the first target of a [[Fold]] */
export function headOption<S, A>(fold: Fold<S, A>, s: S): Maybe<A> {
  return find(fold, () => true, s)
}

/** check if at least one target satisfies the predicate */
export function exist<S, A>(fold: Fold<S, A>, p: Predicate<A>, s: S): boolean {
  return fold.foldMap(any, p, s)
}

/** check if all targets satisfy the predicate */
export function all<S, A>(fold: Fold<S, A>, p: Predicate<A>, s: S): boolean {
  return fold.foldMap(allMonoid, p, s)
}

/** join two Fold with the same target */
export function choice<S1, S2, A>(fold1: Fold<S1, A>, fold2: Fold<S2, A>): Fold<Either<S1, S2>, A> {
  return {
    foldMap<M>(monoid: Monoid<M>, f: (a: A) => M, s: Either<S1, S2>): M {
      return either.either(s1 => fold1.foldMap(monoid, f, s1), s2 => fold2.foldMap(monoid, f, s2), s)
    }
  }
}

export function composeFold<S, A, B>(ab: Fold<A, B>, sa: Fold<S, A>): Fold<S, B> {
  return {
    foldMap<M>(monoid: Monoid<M>, f: (b: B) => M, s: S): M {
      return sa.foldMap(monoid, a => ab.foldMap(monoid, f, a), s)
    }
  }
}

export function fromFoldable<F, A>(fold: Foldable<F>): Fold<HKT<F, A>, A> {
  return {
    foldMap<M>(monoid: Monoid<M>, f: (a: A) => M, s: HKT<F, A>): M {
      return foldable.foldMap(fold, monoid, f, s)
    }
  }
}
