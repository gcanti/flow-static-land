// @flow
import { HKT } from './HKT'
import type { HKT2 } from './HKT'
import type { Monad } from './Monad'

class IsEff {}

export type Eff<E, A> = HKT2<IsEff, E, A>;
export type Pure<A> = Eff<{}, A>;

function prj<E: Object, A>(fa: Eff<E, A>): () => A {
  return ((fa: any): () => A)
}

export function inj<E: Object, A>(run: () => A): Eff<E, A> {
  return ((run: any): Eff<E, A>)
}

export function runEff<E: Object, A>(eff: Eff<E, A>): A {
  return prj(eff)()
}

export function runPure<A>(pure: Pure<A>): A {
  return runEff(pure)
}

export function map<E: Object, A, B>(f: (a: A) => B, fa: Eff<E, A>): Eff<E, B> {
  return inj(() => f(runEff(fa)))
}

export function ap<E1: Object, E2: Object, A, B>(fab: Eff<E1, (a: A) => B>, fa: Eff<E2, A>): Eff<E1 & E2, B> {
  return inj(() => runEff(fab)(runEff(fa)))
}

export function of<A>(a: A): Pure<A> {
  return inj(() => a)
}

export function chain<E1: Object, E2: Object, A, B>(f: (a: A) => Eff<E1, B>, fa: Eff<E2, A>): Eff<E1 & E2, B> {
  return inj(() => runEff(f(runEff(fa))))
}

if (false) { // eslint-disable-line
  ({
    map,
    ap,
    of,
    chain
  }: Monad<HKT<IsEff, *>>)
}
