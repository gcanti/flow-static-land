// @flow
import { HKT } from './HKT'
import type { Functor } from './Functor'

export interface Pointed<F> extends Functor<F> {
  of<A>(a: A): HKT<F, A>
}
