// @flow
import type { HKT2 } from './HKT'
import type { Semigroupoid } from './Semigroupoid'

export interface Category<A> extends Semigroupoid<A> {
  id(): HKT2<A, any, any>
}
