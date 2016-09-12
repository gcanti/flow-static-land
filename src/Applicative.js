// @flow
import { HKT } from './HKT'
import type { Apply } from './Apply'

export interface Applicative<F> extends Apply<F> {
  of<A>(a: A): HKT<F, A>
}
