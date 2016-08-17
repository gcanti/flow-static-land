// @flow
import { HKT } from './HKT'

export interface Functor<F> {
  map<A, B>(f: (a: A) => B, fa: HKT<F, A>): HKT<F, B>
}

export function map<F, A, B>(dictFunctor: Functor<F>, f: (a: A) => B, fa: HKT<F, A>): HKT<F, B> {
  return dictFunctor.map(f, fa)
}

export function lift<F, A, B>(dictFunctor: Functor<F>, f: (a: A) => B): (fa: HKT<F, A>) => HKT<F, B> {
  return fa => dictFunctor.map(f, fa)
}