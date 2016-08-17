// @flow
import { HKT } from './HKT'
import type { HKT2 } from './HKT'
import type { Monad } from './Monad'

class Eff {}

export const t = Eff

export type Pure<A> = HKT2<Eff, {}, A>;

function prj<E: Object, A>(fa: HKT2<Eff, E, A>): () => A {
  return ((fa: any): () => A)
}

function inj<E: Object, A>(run: () => A): HKT2<Eff, E, A> {
  return ((run: any): HKT2<Eff, E, A>)
}

export function runEff<E: Object, A>(eff: HKT2<Eff, E, A>): A {
  return prj(eff)()
}

export function runPure<A>(pure: Pure<A>): A {
  return runEff(pure)
}

export function map<E: Object, A, B>(f: (a: A) => B, fa: HKT2<Eff, E, A>): HKT2<Eff, E, B> {
  return inj(() => f(runEff(fa)))
}

export function ap<E1: Object, E2: Object, A, B>(fab: HKT2<Eff, E1, (a: A) => B>, fa: HKT2<Eff, E2, A>): HKT2<Eff, E1 & E2, B> {
  return inj(() => runEff(fab)(runEff(fa)))
}

export function of<A>(a: A): Pure<A> {
  return inj(() => a)
}

export function chain<E1: Object, E2: Object, A, B>(f: (a: A) => HKT2<Eff, E1, B>, fa: HKT2<Eff, E2, A>): HKT2<Eff, E1 & E2, B> {
  return inj(() => runEff(f(runEff(fa))))
}

if (false) { // eslint-disable-line
  ({
    map,
    ap,
    of,
    chain
  }: Monad<HKT<Eff, *>, *, *>)
}
