// @flow
import { HKT } from './HKT'
import type { Monoid } from './Monoid'
import type { Semigroup } from './Semigroup'
import type { Monad } from './Monad'
import type { Foldable } from './Foldable'
import type { Alt } from './Alt'
import type { Plus } from './Plus'
import type { Alternative } from './Alternative'
import type { Extend } from './Extend'
import type { Setoid } from './Setoid'

class IsMaybe {}

export type Maybe<A> = HKT<IsMaybe, A>;

// keep private
function prj<A>(fa: Maybe<A>): A {
  return ((fa: any): A)
}

// keep private
function inj<A>(a: A): Maybe<A> {
  return ((a: any): Maybe<A>)
}

export function isNothing<A>(x: Maybe<A>): boolean {
  return x == Nothing
}

export function isJust<A>(x: Maybe<A>): boolean {
  return x != Nothing
}

export function empty<A>(): Maybe<A> {
  return Nothing
}

export const pempty = empty

export function concat<A>(dictSemigroup: Semigroup<A>, a: Maybe<A>, b: Maybe<A>): Maybe<A> {
  if (isNothing(a) || isNothing(b)) {
    return Nothing
  }
  return inj(dictSemigroup.concat(prj(a), prj(b)))
}

export function getMonoid<A>(dictSemigroup: Semigroup<A>): Monoid<Maybe<A>> {
  return {
    empty,
    concat(a, b) {
      return concat(dictSemigroup, a, b)
    }
  }
}

export function map<A, B>(f: (a: A) => B, fa: Maybe<A>): Maybe<B> {
  return isNothing(fa) ? Nothing : inj(f(prj(fa)))
}

export function ap<A, B>(fab: Maybe<(a: A) => B>, fa: Maybe<A>): Maybe<B> {
  return isNothing(fab) ? Nothing : map(prj(fab), fa)
}

export function of<A>(a: A): Maybe<A> {
  return inj(a)
}

export function chain<A, B>(f: (a: A) => Maybe<B>, fa: Maybe<A>): Maybe<B> {
  return isNothing(fa) ? Nothing : f(prj(fa))
}

export const Nothing: Maybe<any> = inj(null)

export function reduce<A, B>(f: (a: A, b: B) => A, a: A, fb: Maybe<B>): A {
  return isNothing(fb) ? a : f(a, prj(fb))
}

export function alt<A>(fx: Maybe<A>, fy: Maybe<A>): Maybe<A> {
  return fx == Nothing ? fy : fx
}

export function extend<A, B>(f: (ea: Maybe<A>) => B, ea: Maybe<A>): Maybe<B> {
  return isNothing(ea) ? Nothing : inj(f(ea))
}

export function equals<A>(dictSetoid: Setoid<A>, fx: Maybe<A>, fy: Maybe<A>): boolean {
  if (isNothing(fx) && isNothing(fy)) {
    return true
  }
  if (isJust(fx) && isJust(fy)) {
    return dictSetoid.equals(prj(fx), prj(fy))
  }
  return false
}

export function getSetoid<A>(dictSetoid: Setoid<A>): Setoid<Maybe<A>> {
  return {
    equals(fx, fy) {
      return equals(dictSetoid, fx, fy)
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
    pempty,
    extend
  }: Monad<IsMaybe> &
     Foldable<IsMaybe> &
     Alt<IsMaybe> &
     Plus<IsMaybe> &
     Alternative<IsMaybe> &
     Extend<IsMaybe>)
}
