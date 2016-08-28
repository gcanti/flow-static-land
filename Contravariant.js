// @flow
import { HKT } from './HKT'

export interface Contravariant<F> {
  contramap<A, B>(f: (a: B) => A, fa: HKT<F, A>): HKT<F, B>
}

export function lift<F, A, B>(contravariant: Contravariant<F>, f: (a: B) => A): (fa: HKT<F, A>) => HKT<F, B> {
  return fa => contravariant.contramap(f, fa)
}
