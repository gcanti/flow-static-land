// @flow
import { HKT } from './HKT'

export interface Foldable<F> {
  reduce<A, B>(f: (a: A, b: B) => A, a: A, fb: HKT<F, B>): A
}

export function reduce<F, A, B>(dictFoldable: Foldable<F>, f: (a: A, b: B) => A, a: A, fb: HKT<F, B>): A {
  return dictFoldable.reduce(f, a, fb)
}
