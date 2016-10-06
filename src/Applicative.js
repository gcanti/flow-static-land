// @flow
import type { Apply } from './Apply'
import type { Pointed } from './Pointed'

export interface Applicative<F> extends Apply<F>, Pointed<F> {}
