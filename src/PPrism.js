// @flow
import type { Either } from './Either'
import type { Maybe } from './Maybe'
import type { POptional } from './POptional'

import * as either from './Either'
import * as maybe from './Maybe'
import { id } from './Identity'

export interface PPrism<S, T, A, B> {
  getOrModify(s: S): Either<T, A>,
  reverseGet(b: B): T
}

export type Prism<S, A> = PPrism<S, S, A, A>;

export function modify<S, T, A, B>(stab: PPrism<S, T, A, B>, f: (a: A) => B, s: S): T {
  return either.either(id, a => stab.reverseGet(f(a)), stab.getOrModify(s))
}

export function createSSAB<S, A, B>(getOption: (s: S) => Maybe<A>, reverseGet: (b: B) => S): PPrism<S, S, A, B> {
  return {
    getOrModify(s: S): Either<S, A> {
      return maybe.maybe(either.left(s), either.right, getOption(s))
    },
    reverseGet
  }
}

export function asOptional<S, T, A, B>(prism: PPrism<S, T, A, B>): POptional<S, T, A, B> {
  return {
    getOrModify: prism.getOrModify,
    set(b: B): T {
      return prism.reverseGet(b)
    }
  }
}

export function composePrism<S, T, A, B, C, D>(abcd: PPrism<A, B, C, D>, stab: PPrism<S, T, A, B>): PPrism<S, T, C, D> {
  return {
    getOrModify(s: S): Either<T, C> {
      return either.chain(
        a => either.bimap(
          stab.reverseGet,
          id,
          abcd.getOrModify(a)
        ),
        stab.getOrModify(s)
      )
    },
    reverseGet(d: D): T {
      return stab.reverseGet(abcd.reverseGet(d))
    }
  }
}
