// @flow
import { HKT } from './HKT'
import type { Apply } from './Apply'

export interface Chain<F> extends Apply<F> {
  chain<A, B>(f: (a: A) => HKT<F, B>, fa: HKT<F, A>): HKT<F, B>
}

export function chain<F, A, B>(chain: Chain<F>, f: (a: A) => HKT<F, B>, fa: HKT<F, A>): HKT<F, B> {
  return chain.chain(f, fa)
}
