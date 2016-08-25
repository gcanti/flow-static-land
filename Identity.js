// @flow
import { HKT } from './HKT'
import type { Setoid } from './Setoid'
import type { Ord } from './Ord'
import type { Semigroup } from './Semigroup'
import type { Monoid } from './Monoid'
import type { Applicative } from './Applicative'
import type { Monad } from './Monad'
import type { Foldable } from './Foldable'
import type { Traversable } from './Traversable'
import type { Alt } from './Alt'
import type { Extend } from './Extend'
import type { Comonad } from './Comonad'

class Identity {}

function prj<A>(fa: HKT<Identity, A>): A {
  return ((fa: any): A)
}

function inj<A>(a: A): HKT<Identity, A> {
  return ((a: any): HKT<Identity, A>)
}

export function id<A>(a: A): A {
  return a
}

export function map<A, B>(f: (a: A) => B, fa: HKT<Identity, A>): HKT<Identity, B> {
  return inj(f(prj(fa)))
}

export function ap<A, B>(fab: HKT<Identity, (a: A) => B>, fa: HKT<Identity, A>): HKT<Identity, B> {
  return map(prj(fab), fa)
}

export const of = inj

export function chain<A, B>(f: (a: A) => HKT<Identity, B>, fa: HKT<Identity, A>): HKT<Identity, B> {
  return f(prj(fa))
}

export function reduce<A, B>(f: (a: A, b: B) => A, a: A, fb: HKT<Identity, B>): A {
  return f(a, prj(fb))
}

export function alt<A>(fx: HKT<Identity, A>, fy: HKT<Identity, A>): HKT<Identity, A> { // eslint-disable-line no-unused-vars
  return fx
}

export function sequence<F, A>(applicative: Applicative<F>, tfa: HKT<Identity, HKT<F, A>>): HKT<F, HKT<Identity, A>> {
  return applicative.map(of, prj(tfa))
}

export function extend<A, B>(f: (ea: HKT<Identity, A>) => B, ea: HKT<Identity, A>): HKT<Identity, B> {
  return of(f(ea))
}

export const extract = prj

export function getSetoid<A>(setoid: Setoid<A>): Setoid<HKT<Identity, A>> {
  return {
    equals(fx, fy) {
      return setoid.equals(prj(fx), prj(fy))
    }
  }
}

export function getOrd<A>(ord: Ord<A>): Ord<HKT<Identity, A>> {
  return {
    equals: getSetoid(ord).equals,
    compare(fx, fy) {
      return ord.compare(prj(fx), prj(fy))
    }
  }
}

export function getSemigroup<A>(semigroup: Semigroup<A>): Semigroup<HKT<Identity, A>> {
  return {
    concat(fx, fy) {
      return inj(semigroup.concat(prj(fx), prj(fy)))
    }
  }
}

export function getMonoid<A>(monoid: Monoid<A>): Monoid<HKT<Identity, A>> {
  return {
    concat: getSemigroup(monoid).concat,
    empty() {
      return inj(monoid.empty())
    }
  }
}

if (false) { // eslint-disable-line
  ({
    map,
    ap,
    of,
    chain,
    reduce,
    alt,
    sequence,
    extend,
    extract
  }: Monad<Identity> & Foldable<Identity> & Traversable<Identity> & Alt<Identity> & Extend<Identity> & Comonad<Identity>)
}
