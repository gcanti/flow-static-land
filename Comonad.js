// @flow
import { HKT } from './HKT'
import type { Functor } from './Functor'
import type { Extend } from './Extend'

export interface Comonad<F, A, B> extends Functor<F, A, B>, Extend<F, A, B> {
  extract(ca: HKT<F, A>): A
}

export function extract<F, A, B>(comonad: Comonad<F, A, B>, ca: HKT<F, A>): A {
  return comonad.extract(ca)
}

