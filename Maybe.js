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
import { id } from './Identity'

class IsMaybe {}

export type Maybe<A> = HKT<IsMaybe, A>;

export function inj<A>(a: ?A): Maybe<A> {
  return ((a: any): Maybe<A>)
}

export function prj<A>(fa: Maybe<A>): ?A {
  return ((fa: any): ?A)
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

export function concat<A>(semigroup: Semigroup<A>, fx: Maybe<A>, fy: Maybe<A>): Maybe<A> {
  const x = prj(fx)
  const y = prj(fy)
  if (x == null || y == null) {
    return Nothing
  }
  return inj(semigroup.concat(x, y))
}

export function getMonoid<A>(semigroup: Semigroup<A>): Monoid<Maybe<A>> {
  return {
    empty,
    concat(a, b) {
      return concat(semigroup, a, b)
    }
  }
}

export function map<A, B>(f: (a: A) => B, fa: Maybe<A>): Maybe<B> {
  const a = prj(fa)
  return a == null ? Nothing : inj(f(a))
}

export function ap<A, B>(fab: Maybe<(a: A) => B>, fa: Maybe<A>): Maybe<B> {
  const ab = prj(fab)
  return ab == null ? Nothing : map(ab, fa)
}

export function of<A>(a: A): Maybe<A> {
  return inj(a)
}

export function chain<A, B>(f: (a: A) => Maybe<B>, fa: Maybe<A>): Maybe<B> {
  const a = prj(fa)
  return a == null ? Nothing : f(a)
}

export const Nothing: Maybe<any> = inj(null)

export function reduce<A, B>(f: (a: A, b: B) => A, a: A, fb: Maybe<B>): A {
  const b = prj(fb)
  return b == null ? a : f(a, b)
}

export function alt<A>(fx: Maybe<A>, fy: Maybe<A>): Maybe<A> {
  return fx == Nothing ? fy : fx
}

export function extend<A, B>(f: (ea: Maybe<A>) => B, ea: Maybe<A>): Maybe<B> {
  return isNothing(ea) ? Nothing : inj(f(ea))
}

export function equals<A>(setoid: Setoid<A>, fx: Maybe<A>, fy: Maybe<A>): boolean {
  const x = prj(fx)
  const y = prj(fy)
  if (x == null || y == null) {
    return true
  }
  if (x != null || y != null) {
    return setoid.equals(x, y)
  }
  return false
}

export function getSetoid<A>(setoid: Setoid<A>): Setoid<Maybe<A>> {
  return {
    equals(fx, fy) {
      return equals(setoid, fx, fy)
    }
  }
}

export function maybe<A, B>(b: B, f: (a: A) => B, fa: Maybe<A>): B {
  const a = prj(fa)
  return a == null ? b : f(a)
}

export function fromMaybe<A>(a: A, fa: Maybe<A>): A {
  return maybe(a, id, fa)
}

export function fromJust<A>(fa: Maybe<A>): A {
  const a = prj(fa)
  if (a == null) {
    throw new Error('fromJust returned a Nothing')
  }
  return a
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
