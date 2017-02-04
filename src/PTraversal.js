// @flow
import type { Fold } from './Fold'
import type { PSetter } from './PSetter'
import type { Monoid } from './Monoid'
import type { Applicative } from './Applicative'
import type { Traversable } from './Traversable'

/*

  A Traversal is the generalisation of an Optional to several targets.
  In other word, a Traversal allows to focus from a type S into 0 to n values of type A.

  The most common example of a Traversal would be to focus into all elements inside of a container (e.g. List, Maybe).

*/

import { HKT } from './HKT'
import { getApplicative, inj, prj } from './Const'
import * as id from './Identity'

export interface PTraversal<S, T, A, B> {
  modifyF<F>(applicative: Applicative<F>, f: (a: A) => HKT<F, B>, s: S): HKT<F, T>
}

export type Traversal<S, A> = PTraversal<S, S, A, A>;

export function modify<S, T, A, B>(traversal: PTraversal<S, T, A, B>, f: (a: A) => B, s: S): T {
  return id.extract(traversal.modifyF(id, a => id.of(f(a)), s))
}

export function asFold<S, T, A, B>(traversal: PTraversal<S, T, A, B>): Fold<S, A> {
  return {
    foldMap<M>(monoid: Monoid<M>, f: (a: A) => M, s: S): M {
      return prj(traversal.modifyF(getApplicative(monoid), a => inj(f(a)), s))
    }
  }
}

export function asSetter<S, T, A, B>(traversal: PTraversal<S, T, A, B>): PSetter<S, T, A, B> {
  return {
    modify(f: (a: A) => B, s: S): T {
      return modify(traversal, f, s)
    }
  }
}

export function composeTraversal<S, T, A, B, C, D>(ab: PTraversal<A, B, C, D>, st: PTraversal<S, T, A, B>): PTraversal<S, T, C, D> {
  return {
    modifyF<F>(applicative: Applicative<F>, f: (c: C) => HKT<F, D>, s: S): HKT<F, T> {
      return st.modifyF(applicative, c => ab.modifyF(applicative, f, c), s)
    }
  }
}

export function fromTraversable<T, A, B>(traversable: Traversable<T>): PTraversal<HKT<T, A>, HKT<T, B>, A, B> {
  return {
    modifyF<F>(applicative: Applicative<F>, f: (a: A) => HKT<F, B>, s: HKT<T, A>): HKT<F, HKT<T, B>> {
      return traversable.traverse(applicative, f, s)
    }
  }
}
