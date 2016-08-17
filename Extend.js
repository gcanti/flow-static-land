// @flow
import { HKT } from './HKT'

export interface Extend<F> {
  extend<A, B>(f: (ea: HKT<F, A>) => B, ea: HKT<F, A>): HKT<F, B>
}

export function extend<F, A, B>(dictExtend: Extend<F>, f: (ea: HKT<F, A>) => B, ea: HKT<F, A>): HKT<F, B> {
  return dictExtend.extend(f, ea)
}
