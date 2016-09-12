// @flow
import type { Applicative } from './Applicative'
import type { Semigroup } from './Semigroup'
import type { Either, EitherF } from './Either'

import * as either from './Either'

export function getApplicative<L>(semigroup: Semigroup<L>): Applicative<EitherF> {
  function ap<A, B>(fab: Either<L, (a: A) => B>, fa: Either<L, A>): Either<L, B> {
    const ab = either.prj(fab)
    const a = either.prj(fa)
    if (ab instanceof either.Left && a instanceof either.Left) {
      return either.left(semigroup.concat(ab.value0, a.value0))
    }
    return either.ap(fab, fa)
  }
  return {
    map: either.map,
    ap,
    of: either.of
  }
}
