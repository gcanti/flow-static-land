// @flow
import type { HKT2 } from './HKT'
import type { Setoid } from './Setoid'
import type { Semigroupoid } from './Semigroupoid'
import type { Semigroup } from './Semigroup'
import type { Monoid } from './Monoid'
import type { Functor } from './Functor'
import type { Contravariant } from './Contravariant'
import type { Apply } from './Apply'
import type { Applicative } from './Applicative'
import type { Chain } from './Chain'

import { HKT } from './HKT'

// The `Const` type constructor, which wraps its first type argument
// and ignores its second. That is, `Const a b` is isomorphic to `a`
// for any `b`.
//
// `Const` has some useful instances. For example, the `Applicative`
// instance allows us to collect results using a `Monoid` while
// ignoring return values.

class IsConst {}

export type ConstV<A, B> = A; // eslint-disable-line no-unused-vars

export type Const<A, B> = HKT2<IsConst, A, B>;

export type ConstF = HKT<IsConst, *>;

export function inj<A, B>(a: ConstV<A, B>): Const<A, B> {
  return ((a: any): Const<A, B>)
}

export function prj<A, B>(a: Const<A, B>): ConstV<A, B> {
  return ((a: any): ConstV<A, B>)
}

export function compose<A, B, C>(x: Const<B, C>, y: Const<A, B>): Const<A, C> {
  return ((y: any): Const<A, C>)
}

export function map<A, B, C>(f: (a: A) => B, fa: Const<C, A>): Const<C, B> {
  return ((fa: any): Const<C, B>)
}

export function contramap<A, B, C>(f: (b: B) => A, fa: Const<C, A>): Const<C, B> {
  return ((fa: any): Const<C, B>)
}

export function getSetoid<A, B>(setoid: Setoid<A>): Setoid<Const<A, B>> {
  return {
    equals(x: Const<A, B>, y: Const<A, B>): boolean {
      return setoid.equals(prj(x), prj(y))
    }
  }
}

export function getSemigroup<A, B>(semigroup: Semigroup<A>): Semigroup<Const<A, B>> {
  return {
    concat(x: Const<A, B>, y: Const<A, B>): Const<A, B> {
      return inj(semigroup.concat(prj(x), prj(y)))
    }
  }
}

export function getMonoid<A, B>(monoid: Monoid<A>): Monoid<Const<A, B>> {
  const { concat } = getSemigroup(monoid)
  const empty: Const<A, any> = inj(monoid.empty())
  return {
    concat,
    empty<B>(): Const<A, B> {
      return empty
    }
  }
}

export function getApply<C>(semigroup: Semigroup<C>): Apply<HKT<IsConst, C>> {
  return {
    map,
    ap<A, B>(fab: Const<C, (a: A) => B>, fa: Const<C, A>): Const<C, B> {
      const x = prj(fab)
      const y = prj(fa)
      return inj(semigroup.concat(x, y))
    }
  }
}

export function getApplicative<A>(monoid: Monoid<A>): Applicative<HKT<IsConst, A>> {
  const { map, ap } = getApply(monoid)
  return {
    map,
    ap,
    of<B>(b: B): Const<A, B> { // eslint-disable-line no-unused-vars
      return inj(monoid.empty())
    }
  }
}

export function getChain<C>(semigroup: Semigroup<C>): Chain<HKT<IsConst, C>> {
  const { map, ap } = getApply(semigroup)
  return {
    map,
    ap,
    chain<A, B>(f: (a: A) => Const<C, B>, fa: Const<C, A>): Const<C, B> {
      return ((fa: any): Const<C, B>)
    }
  }
}

if (false) { // eslint-disable-line
  ({
    compose,
    map,
    contramap
  }: Functor<ConstF> &
     Contravariant<ConstF> &
     Semigroupoid<IsConst>)
}
