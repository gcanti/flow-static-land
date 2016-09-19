// @flow
import { HKT } from './HKT'
import type { HKT2 } from './HKT'
import type { Monad } from './Monad'

class IsEff {}

export type EffV<A> = () => A;

export type Eff<E, A> = HKT2<IsEff, E, A>;

export type EffF = HKT<IsEff, *>;

export type Pure<A> = Eff<{}, A>;

export function inj<E, A>(a: EffV<A>): Eff<E, A> {
  return ((a: any): Eff<E, A>)
}

export function prj<E, A>(fa: Eff<E, A>): EffV<A> {
  return ((fa: any): EffV<A>)
}

export function runEff<E, A>(eff: Eff<E, A>): A {
  return prj(eff)()
}

export function runPure<A>(pure: Pure<A>): A {
  return runEff(pure)
}

export function map<E, A, B>(f: (a: A) => B, fa: Eff<E, A>): Eff<E, B> {
  return inj(() => f(runEff(fa)))
}

export function ap<E1, E2, E: E1 & E2, A, B>(fab: Eff<E1, (a: A) => B>, fa: Eff<E2, A>): Eff<E, B> {
  return inj(() => runEff(fab)(runEff(fa)))
}

export function of<E, A>(a: A): Eff<E, A> {
  return inj(() => a)
}

export function chain<E1, E2, E: E1 & E2, A, B>(f: (a: A) => Eff<E1, B>, fa: Eff<E2, A>): Eff<E, B> {
  return inj(() => runEff(f(runEff(fa))))
}

if (false) { // eslint-disable-line
  ({
    map,
    ap,
    of,
    chain
  }: Monad<EffF>)
}
