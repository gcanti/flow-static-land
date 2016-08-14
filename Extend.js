// @flow
import { HKT } from './HKT'

export interface Extend<F, A, B> {
  extend(f: (ea: HKT<F, A>) => B, ea: HKT<F, A>): HKT<F, B>
}

export function extend<F, A, B>(extend: Extend<F, A, B>, f: (ea: HKT<F, A>) => B, ea: HKT<F, A>): HKT<F, B> {
  return extend.extend(f, ea)
}
