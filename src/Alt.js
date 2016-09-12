// @flow
import { HKT } from './HKT'
import type { Functor } from './Functor'

export interface Alt<F> extends Functor<F> {
  alt<A>(fx: HKT<F, A>, fy: HKT<F, A>): HKT<F, A>
}
