// @flow
import { HKT } from './HKT'
import type { Semigroupoid } from './Semigroupoid'

export interface Category<A> extends Semigroupoid<A> {
  id(): HKT<HKT<A, any>, any>
}
