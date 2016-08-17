// @flow
import { HKT } from './HKT'
import type { Monoid } from './Monoid'
import type { Semigroup } from './Semigroup'
import type { Monad } from './Monad'
import type { Foldable } from './Foldable'
import type { Alt } from './Alt'

class Maybe {}

export const t = Maybe

function prj<A>(fa: HKT<Maybe, A>): A {
  return ((fa: any): A)
}

function inj<A>(a: A): HKT<Maybe, A> {
  return ((a: any): HKT<Maybe, A>)
}

export function isNothing<A>(x: HKT<Maybe, A>): boolean {
  return x == Nothing
}

export function empty<S>(): HKT<Maybe, S> {
  return Nothing
}

export function concat<S>(dictSemigroup: Semigroup<S>, a: HKT<Maybe, S>, b: HKT<Maybe, S>): HKT<Maybe, S> {
  if (isNothing(a) || isNothing(b)) {
    return Nothing
  }
  return inj(dictSemigroup.concat(prj(a), prj(b)))
}

export function getMonoid<S>(dictSemigroup: Semigroup<S>): Monoid<HKT<Maybe, S>> {
  return {
    empty,
    concat(a, b) {
      return concat(dictSemigroup, a, b)
    }
  }
}

export function map<A, B>(f: (a: A) => B, fa: HKT<Maybe, A>): HKT<Maybe, B> {
  return isNothing(fa) ? Nothing : inj(f(prj(fa)))
}

export function ap<A, B>(fab: HKT<Maybe, (a: A) => B>, fa: HKT<Maybe, A>): HKT<Maybe, B> {
  return isNothing(fab) ? Nothing : map(prj(fab), fa)
}

export function of<A>(a: A): HKT<Maybe, A> {
  return inj(a)
}

export function chain<A, B>(f: (a: A) => HKT<Maybe, B>, fa: HKT<Maybe, A>): HKT<Maybe, B> {
  return isNothing(fa) ? Nothing : f(prj(fa))
}

export const Nothing: HKT<Maybe, any> = inj(null)

export function reduce<A, B>(f: (a: A, b: B) => A, a: A, fb: HKT<Maybe, B>): A {
  return isNothing(fb) ? a : f(a, prj(fb))
}

export function alt<A>(fx: HKT<Maybe, A>, fy: HKT<Maybe, A>): HKT<Maybe, A> {
  return fx == Nothing ? fy : fx
}

if (false) { // eslint-disable-line
  ({
    map,
    ap,
    of,
    chain,
    reduce,
    alt
  }: Monad<Maybe> & Foldable<Maybe> & Alt<Maybe>)
}
