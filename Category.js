// @flow
import type { HKT2 } from './HKT'
import type { Semigroupoid } from './Semigroupoid'

export interface Category<C> extends Semigroupoid<C> {
  id(): HKT2<C, any, any>
}
