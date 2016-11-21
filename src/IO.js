// @flow
import { HKT } from './HKT'
import type { Monad } from './Monad'
import type { Semigroup } from './Semigroup'
import type { Monoid } from './Monoid'
import type { Eff } from './Eff'

class IsIO {}

export type IOV<A> = () => A;

export type IO<A> = HKT<IsIO, A>;

export function inj<A>(a: IOV<A>): IO<A> {
  return ((a: any): IO<A>)
}

export function prj<A>(fa: IO<A>): IOV<A> {
  return ((fa: any): IOV<A>)
}

export function runIO<A>(eff: IO<A>): A {
  return prj(eff)()
}

export function map<A, B>(f: (a: A) => B, fa: IO<A>): IO<B> {
  return inj(() => f(runIO(fa)))
}

export function ap<A, B>(fab: IO<(a: A) => B>, fa: IO<A>): IO<B> {
  return inj(() => runIO(fab)(runIO(fa)))
}

export function of<A>(a: A): IO<A> {
  return inj(() => a)
}

export function chain<A, B>(f: (a: A) => IO<B>, fa: IO<A>): IO<B> {
  return inj(() => runIO(f(runIO(fa))))
}

export function concat<A>(semigroup: Semigroup<A>): (fx: IO<A>, fy: IO<A>) => IO<A> {
  return function concat(fx, fy) {
    return inj(() => semigroup.concat(runIO(fx), runIO(fy)))
  }
}

export function getSemigroup<A>(semigroup: Semigroup<A>): Semigroup<IO<A>> {
  return {
    concat: concat(semigroup)
  }
}

export function getMonoid<A>(monoid: Monoid<A>): Monoid<IO<A>> {
  return {
    empty: () => of(monoid.empty()),
    concat: concat(monoid)
  }
}

export function fromEff<E, A>(fa: Eff<E, A>): IO<A> {
  return ((fa: any): IO<A>)
}

export function toEff<E, A>(fa: IO<A>): Eff<E, A> {
  return ((fa: any): Eff<E, A>)
}

if (false) { // eslint-disable-line
  ({
    map,
    ap,
    of,
    chain
  }: Monad<IsIO>)
}
