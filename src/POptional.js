// @flow
import type { Either } from './Either'
import type { Maybe } from './Maybe'
import type { PTraversal } from './PTraversal'
import type { Applicative } from './Applicative'

import { HKT } from './HKT'
import * as either from './Either'
import * as maybe from './Maybe'
import { id } from './Identity'

export interface POptional<S, T, A, B> {
  getOrModify(s: S): Either<T, A>,
  set(b: B, s: S): T
}

export type Optional<S, A> = POptional<S, S, A, A>;

function toMaybe<L, R>(e: Either<L, R>): Maybe<R> {
  return either.either(maybe.toNothing, maybe.of, e)
}

export function getOption<S, T, A, B>(stab: POptional<S, T, A, B>, s: S): Maybe<A> {
  return toMaybe(stab.getOrModify(s))
}

export function modify<S, T, A, B>(optional: POptional<S, T, A, B>, f: (a: A) => B, s: S): T {
  return either.either(
    id,
    a => optional.set(f(a), s),
    optional.getOrModify(s)
  )
}

/** join two POptional with the same target */
export function choice<S1, T1, S2, T2, A, B>(optional1: POptional<S1, T1, A, B>, optional2: POptional<S2, T2, A, B>): POptional<Either<S1, S2>, Either<T1, T2>, A, B> {
  return {
    getOrModify(s: Either<S1, S2>): Either<Either<T1, T2>, A> {
      return either.either(
        s1 => either.leftMap(either.left, optional1.getOrModify(s1)),
        s2 => either.leftMap(either.right, optional2.getOrModify(s2)),
        s
      )
    },
    set(b: B, s: Either<S1, S2>): Either<T1, T2> {
      return either.bimap(s1 => optional1.set(b, s1), s2 => optional2.set(b, s2), s)
    }
  }
}

export function asTraversal<S, T, A, B>(optional: POptional<S, T, A, B>): PTraversal<S, T, A, B> {
  return {
    modifyF<F>(applicative: Applicative<F>, f: (a: A) => HKT<F, B>, s: S): HKT<F, T> {
      return either.either(
        applicative.of,
        a => applicative.map(b => optional.set(b, s), f(a)),
        optional.getOrModify(s)
      )
    }
  }
}

export function composeOptional<S, T, A, B, C, D>(abcd: POptional<A, B, C, D>, stab: POptional<S, T, A, B>): POptional<S, T, C, D> {
  return {
    getOrModify(s: S): Either<T, C> {
      return either.chain(
        a => either.bimap(
          b => stab.set(b, s),
          id,
          abcd.getOrModify(a)
        ),
        stab.getOrModify(s)
      )
    },
    set(d: D, s: S): T {
      return modify(stab, a => abcd.set(d, a), s)
    }
  }
}
