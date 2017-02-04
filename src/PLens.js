// @flow
import type { Getter } from './Getter'
import type { POptional } from './POptional'
import type { Either } from './Either'

import * as either from './Either'
import * as getter from './Getter'

/*

  A Lens is an optic used to zoom inside a Product, e.g. case class, Tuple, HList or even Map.

  Lenses have two type parameters generally called S and A: Lens[S, A] where S represents the Product and A an element inside of S.

*/

export interface PLens<S, T, A, B> extends Getter<S, A> {
  set(b: B, s: S): T
}

export type Lens<S, A> = PLens<S, S, A, A>;

export function modify<S, T, A, B>(lens: PLens<S, T, A, B>, f: (a: A) => B, s: S): T {
  return lens.set(f(lens.get(s)), s)
}

/** join two PLens with the same target */
export function choice<S1, T1, S2, T2, A, B>(lens1: PLens<S1, T1, A, B>, lens2: PLens<S2, T2, A, B>): PLens<Either<S1, S2>, Either<T1, T2>, A, B> {
  return {
    get: getter.choice(lens1, lens2).get,
    set(b: B, s: Either<S1, S2>): Either<T1, T2> {
      return either.bimap(s1 => lens1.set(b, s1), s2 => lens2.set(b, s2), s)
    }
  }
}

export function asOptional<S, T, A, B>(lens: PLens<S, T, A, B>): POptional<S, T, A, B> {
  return {
    getOrModify(s: S): Either<T, A> {
      return either.right(lens.get(s))
    },
    set: lens.set
  }
}

export function composeLens<S, T, A, B, C, D>(abcd: PLens<A, B, C, D>, stab: PLens<S, T, A, B>): PLens<S, T, C, D> {
  return {
    get(s: S): C {
      return abcd.get(stab.get(s))
    },
    set(d: D, s: S): T {
      return modify(stab, a => abcd.set(d, a), s)
    }
  }
}
