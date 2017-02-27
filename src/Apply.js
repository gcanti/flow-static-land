// @flow
import { HKT } from './HKT'
import type { Functor } from './Functor'

export interface Apply<F> extends Functor<F> {
  ap<A, B>(fab: HKT<F, (a: A) => B>, fa: HKT<F, A>): HKT<F, B>
}

export function liftA2<F, A, B, C>(apply: Apply<F>, f: (a: A, b: B) => C): (fa: HKT<F, A>, fb: HKT<F, B>) => HKT<F, C> {
  const cf = a => b => f(a, b)
  return (fa, fb) => apply.ap(apply.map(cf, fa), fb)
}

export function liftA3<F, A, B, C, D>(apply: Apply<F>, f: (a: A, b: B, c: C) => D): (fa: HKT<F, A>, fb: HKT<F, B>, fc: HKT<F, C>) => HKT<F, D> {
  const cf = a => b => c => f(a, b, c)
  return (fa, fb, fc) => apply.ap(apply.ap(apply.map(cf, fa), fb), fc)
}

export function liftA4<F, A, B, C, D, E>(apply: Apply<F>, f: (a: A, b: B, c: C, d: D) => E): (fa: HKT<F, A>, fb: HKT<F, B>, fc: HKT<F, C>, fd: HKT<F, D>) => HKT<F, E> {
  const cf = a => b => c => d => f(a, b, c, d)
  return (fa, fb, fc, fd) => apply.ap(apply.ap(apply.ap(apply.map(cf, fa), fb), fc), fd)
}
