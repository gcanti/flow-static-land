// @flow
import { HKT } from './HKT'
import type { Functor } from './Functor'

export interface Copointed<F> extends Functor<F> {
  extract<A>(ca: HKT<F, A>): A
}
