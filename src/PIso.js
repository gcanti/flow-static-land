// @flow
import type { PLens } from './PLens'
import type { PPrism } from './PPrism'
import type { Either } from './Either'

import * as either from './Either'

export interface PIso<S, T, A, B> {
  get(s: S): A,
  reverseGet(b: B): T
}

export type Iso<S, A> = PIso<S, S, A, A>;

export function modify<S, T, A, B>(iso: PIso<S, T, A, B>, f: (a: A) => B, s: S): T {
  return iso.reverseGet(f(iso.get(s)))
}

export function composeIso<S, T, A, B, C, D>(abcd: PIso<A, B, C, D>, stab: PIso<S, T, A, B>): PIso<S, T, C, D> {
  return {
    get(s: S): C {
      return abcd.get(stab.get(s))
    },
    reverseGet(d: D): T {
      return stab.reverseGet(abcd.reverseGet(d))
    }
  }
}

export function asLens<S, T, A, B>(iso: PIso<S, T, A, B>): PLens<S, T, A, B> {
  return {
    get: iso.get,
    set: iso.reverseGet
  }
}

export function asPrism<S, T, A, B>(iso: PIso<S, T, A, B>): PPrism<S, T, A, B> {
  return {
    getOrModify(s: S): Either<T, A> {
      return either.right(iso.get(s))
    },
    reverseGet: iso.reverseGet
  }
}
