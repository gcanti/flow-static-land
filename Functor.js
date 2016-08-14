// @flow
import { HKT } from './HKT'

export interface Functor<F, A, B> {
  map(f: (a: A) => B, fa: HKT<F, A>): HKT<F, B>
}

export function map<F, A, B>(functor: Functor<F, A, B>, f: (a: A) => B, fa: HKT<F, A>): HKT<F, B> {
  return functor.map(f, fa)
}

export function lift<F, A, B>(functor: Functor<F, A, B>, f: (a: A) => B): (fa: HKT<F, A>) => HKT<F, B> {
  return fa => functor.map(f, fa)
}