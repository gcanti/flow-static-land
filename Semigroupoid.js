// @flow
import { HKT } from './HKT'

export interface Semigroupoid<A> {
  compose<B, C, D>(x: HKT<HKT<A, C>, D>, y: HKT<HKT<A, B>, C>): HKT<HKT<A, B>, D>
}

export function compose<A, B, C, D>(dictSemigroupoid: Semigroupoid<A>, x: HKT<HKT<A, C>, D>, y: HKT<HKT<A, B>, C>): HKT<HKT<A, B>, D> {
  return dictSemigroupoid.compose(x, y)
}
