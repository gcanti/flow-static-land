// @flow
import type { HKT2 } from './HKT'

export interface Semigroupoid<A> {
  compose<B, C, D>(x: HKT2<A, C, D>, y: HKT2<A, B, C>): HKT2<A, B, D>
}
