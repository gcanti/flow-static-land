// @flow
import type { Chain } from './Chain'
import type { Either } from './Either'

import { HKT } from './HKT'
import * as either from './Either'

export interface ChainRec<M> extends Chain<M> {
  chainRec<A, B>(f: (a: A) => HKT<M, Either<A, B>>, a: A): HKT<M, B>;
}

export function tailRec<A, B>(f: (a: A) => Either<A, B>, a: A): B {
  let v = f(a)
  while (either.isLeft(v)) {
    v = f(either.fromLeft(v))
  }
  return either.fromRight(v)
}
