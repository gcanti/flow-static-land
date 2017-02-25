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
import type { ChainRec } from './ChainRec'
import type { Either } from './Either'

import { tailRec } from './ChainRec'
import { compose } from './Fun'

class IsIdentity {}

export type Identity<A> = HKT<IsIdentity, A>;

function prj<A>(fa: HKT<IsIdentity, A>): A {
  return ((fa: any): A)
}

function inj<A>(a: A): HKT<IsIdentity, A> {
  return ((a: any): HKT<IsIdentity, A>)
}

export function id<A>(a: A): A {
  return a
}

export function map<A, B>(f: (a: A) => B, fa: Identity<A>): Identity<B> {
  return inj(f(prj(fa)))
}

export function ap<A, B>(fab: Identity<(a: A) => B>, fa: Identity<A>): Identity<B> {
  return map(prj(fab), fa)
}

export const of = inj

export function chain<A, B>(f: (a: A) => Identity<B>, fa: Identity<A>): Identity<B> {
  return f(prj(fa))
}

export function reduce<A, B>(f: (b: B, a: A) => B, b: B, fa: Identity<A>): B {
  return f(b, prj(fa))
}

export function alt<A>(fx: Identity<A>, fy: Identity<A>): Identity<A> { // eslint-disable-line no-unused-vars
  return fx
}

export function traverse<F, A, B>(applicative: Applicative<F>, f: (a: A) => HKT<F, B>, ta: Identity<A>): HKT<F, Identity<B>> {
  return applicative.map(of, f(prj(ta)))
}

export function extend<A, B>(f: (ea: Identity<A>) => B, ea: Identity<A>): Identity<B> {
  return of(f(ea))
}

export const extract = prj

export function chainRec<A, B>(f: (a: A) => Identity<Either<A, B>>, a: A): Identity<B> {
  return inj(tailRec(compose(extract, f), a))
}

export function getSetoid<A>(setoid: Setoid<A>): Setoid<Identity<A>> {
  return {
    equals(fx, fy) {
      return setoid.equals(prj(fx), prj(fy))
    }
  }
}

export function getOrd<A>(ord: Ord<A>): Ord<Identity<A>> {
  return {
    equals: getSetoid(ord).equals,
    compare(fx, fy) {
      return ord.compare(prj(fx), prj(fy))
    }
  }
}

export function getSemigroup<A>(semigroup: Semigroup<A>): Semigroup<Identity<A>> {
  return {
    concat(fx, fy) {
      return inj(semigroup.concat(prj(fx), prj(fy)))
    }
  }
}

export function getMonoid<A>(monoid: Monoid<A>): Monoid<Identity<A>> {
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
    traverse,
    extend,
    extract,
    chainRec
  }: Monad<IsIdentity> &
     Foldable<IsIdentity> &
     Traversable<IsIdentity> &
     Alt<IsIdentity> &
     Extend<IsIdentity> &
     Comonad<IsIdentity> &
     ChainRec<IsIdentity>)
}
