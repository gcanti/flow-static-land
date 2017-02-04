// @flow
import { HKT } from './HKT'
import type { Monoid } from './Monoid'
import type { Applicative } from './Applicative'
import type { Semigroup } from './Semigroup'
import type { Monad } from './Monad'
import type { Foldable } from './Foldable'
import type { Alt } from './Alt'
import type { Plus } from './Plus'
import type { Alternative } from './Alternative'
import type { Extend } from './Extend'
import type { Setoid } from './Setoid'
import type { Traversable } from './Traversable'
import type { MonadError } from './MonadError'

import { id } from './Identity'
import { constant } from './Fun'

class IsMaybe {}

export type MaybeV<A> = ?A;

export type Maybe<A> = HKT<IsMaybe, A>;

export function inj<A>(a: MaybeV<A>): Maybe<A> {
  return ((a: any): Maybe<A>)
}

export function prj<A>(fa: Maybe<A>): MaybeV<A> {
  return ((fa: any): MaybeV<A>)
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

export function concat<A>(semigroup: Semigroup<A>): (fx: Maybe<A>, fy: Maybe<A>) => Maybe<A> {
  return function concat(fx, fy) {
    const x = prj(fx)
    const y = prj(fy)
    if (x == null) {
      return fy
    }
    if (y == null) {
      return fx
    }
    return of(semigroup.concat(x, y))
  }
}

export function getSemigroup<A>(semigroup: Semigroup<A>): Semigroup<Maybe<A>> {
  return {
    concat: concat(semigroup)
  }
}

export function getMonoid<A>(semigroup: Semigroup<A>): Monoid<Maybe<A>> {
  return {
    empty,
    concat: concat(semigroup)
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
  return maybe(Nothing, f, fa)
}

export const Nothing: Maybe<any> = inj(null)

export function reduce<A, B>(f: (b: B, a: A) => B, b: B, fa: Maybe<A>): B {
  const a = prj(fa)
  return a == null ? b : f(b, a)
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

export function traverse<F, A, B>(applicative: Applicative<F>, f: (a: A) => HKT<F, B>, ta: Maybe<A>): HKT<F, Maybe<B>> {
  const a = prj(ta)
  if (a == null) {
    return applicative.of(Nothing)
  }
  return applicative.map(of, f(a))
}

export function throwError<A>(e: void): Maybe<A> { // eslint-disable-line no-unused-vars
  return Nothing
}

export function catchError<A>(ma: Maybe<A>, handler: (e: void) => Maybe<A>): Maybe<A> {
  const a = prj(ma)
  return a == null ? handler() : ma
}

export function getSetoid<A>(setoid: Setoid<A>): Setoid<Maybe<A>> {
  return {
    equals(fx, fy) {
      return equals(setoid, fx, fy)
    }
  }
}

export function maybe<A, B>(b: B, f: (a: A) => B, fa: Maybe<A>): B {
  return reduce((_, a) => f(a), b, fa)
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

// Maybe monoid returning the leftmost non-Nothing value.
export const first: Monoid<Maybe<any>> = {
  empty,
  concat: alt
}

export const toNothing = constant(maybe.Nothing)

/*

  Do notation (experimental)

  Example:

  import * as maybe from '../Maybe'

  const x: Maybe<number> = maybe.Do.of(3)
    .map(n => n * 2)
    .chain(n => maybe.of(n - 1))
    .value

*/
export class Do<A> {
  static of(a: A): Do<A> {
    return new Do(of(a))
  }
  value: Maybe<A>;
  constructor(value: Maybe<A>) {
    this.value = value
  }
  map<B>(f: (a: A) => B): Do<B> {
    return new Do(map(f, this.value))
  }
  chain<B>(f: (a: A) => Maybe<B>): Do<B> {
    return new Do(chain(f, this.value))
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
    extend,
    traverse,
    throwError,
    catchError
  }: Monad<IsMaybe> &
     Foldable<IsMaybe> &
     Alt<IsMaybe> &
     Plus<IsMaybe> &
     Alternative<IsMaybe> &
     Extend<IsMaybe> &
     Traversable<IsMaybe> &
     MonadError<*, IsMaybe>)
}
