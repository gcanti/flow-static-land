// @flow
import type { Monoid } from './Monoid'
import type { Fold } from './Fold'
import type { Either } from './Either'

import * as either from './Either'

export interface Getter<S, A> {
  /** get the target of a [[Getter]] */
  get(s: S): A
}

export function asFold<S, A>(getter: Getter<S, A>): Fold<S, A> {
  return {
    foldMap<M>(monoid: Monoid<M>, f: (a: A) => M, s: S): M {
      return f(getter.get(s))
    }
  }
}

/** join two Getter with the same target */
export function choice<S1, S2, A>(getter1: Getter<S1, A>, getter2: Getter<S2, A>): Getter<Either<S1, S2>, A> {
  return {
    get(s: Either<S1, S2>): A {
      return either.either(getter1.get, getter2.get, s)
    }
  }
}

export function composeGetter<S, A, B>(ab: Getter<A, B>, sa: Getter<S, A>): Getter<S, B> {
  return {
    get(s: S): B {
      return ab.get(sa.get(s))
    }
  }
}
