// @flow
import type { Either } from './Either'
import type { Functor } from './Functor'

import { HKT } from './HKT'
import * as either from './Either'

/*

 A [[PSetter]] is a generalisation of Functor map:
 - `map:    (A => B) => F[A] => F[B]`
 - `modify: (A => B) => S    => T`

*/

export interface PSetter<S, T, A, B> {
  modify(f: (a: A) => B, s: S): T
}

export type Setter<S, A> = PSetter<S, S, A, A>;

export function set<S, T, A, B>(setter: PSetter<S, T, A, B>, b: B, s: S): T {
  return setter.modify(() => b, s)
}

/** join two PSetter with the same target */
export function choice<S1, T1, S2, T2, A, B>(setter1: PSetter<S1, T1, A, B>, setter2: PSetter<S2, T2, A, B>): PSetter<Either<S1, S2>, Either<T1, T2>, A, B> {
  return {
    modify(f: (a: A) => B, s: Either<S1, S2>): Either<T1, T2> {
      return either.either(
        s1 => either.left(setter1.modify(f, s1)),
        s2 => either.right(setter2.modify(f, s2)),
        s
      )
    }
  }
}

export function composeSetter<S, T, A, B, C, D>(abcd: PSetter<A, B, C, D>, stab: PSetter<S, T, A, B>): PSetter<S, T, C, D> {
  return {
    modify(f: (c: C) => D, s: S): T {
      return stab.modify(c => abcd.modify(f, c), s)
    }
  }
}

export function fromFunctor<F, A, B>(functor: Functor<F>): PSetter<HKT<F, A>, HKT<F, B>, A, B> {
  return {
    modify(f: (a: A) => B, s: HKT<F, A>): HKT<F, B> {
      return functor.map(f, s)
    }
  }
}
