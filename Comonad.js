// @flow
import { HKT } from './HKT'
import type { Functor } from './Functor'
import type { Extend } from './Extend'

export interface Comonad<F> extends Functor<F>, Extend<F> {
  extract<A>(ca: HKT<F, A>): A
}

export function extract<F, A>(dictComonad: Comonad<F>, ca: HKT<F, A>): A {
  return dictComonad.extract(ca)
}
