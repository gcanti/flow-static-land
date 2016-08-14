// @flow
import { HKT } from './HKT'

export interface Foldable<F, A, B> {
  reduce(f: (a: A, b: B) => A, a: A, fb: HKT<F, B>): A
}

export function reduce<F, A, B>(foldable: Foldable<F, A, B>, f: (a: A, b: B) => A, a: A, fb: HKT<F, B>): A {
  return foldable.reduce(f, a, fb)
}
