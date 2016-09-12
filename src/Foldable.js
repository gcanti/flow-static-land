// @flow
import { HKT } from './HKT'

export interface Foldable<F> {
  reduce<A, B>(f: (a: A, b: B) => A, a: A, fb: HKT<F, B>): A
}
