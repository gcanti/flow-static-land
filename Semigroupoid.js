// @flow
import type { HKT2 } from './HKT'

export interface Semigroupoid<S> {
  compose<A, B, C>(x: HKT2<S, B, C>, y: HKT2<S, A, B>): HKT2<S, A, C>
}
