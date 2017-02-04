// @flow
import type { Semigroup } from './Semigroup'
import { getProductSemigroup } from './Semigroup'

export interface Monoid<A> extends Semigroup<A> {
  empty(): A
}

// Fold a list using the monoid
export function concatAll<A>(monoid: Monoid<A>, as: Array<A>): A {
  return as.reduce(monoid.concat, monoid.empty())
}

export function getProductMonoid<A, B>(amonoid: Monoid<A>, bmonoid: Monoid<B>): Monoid<[A, B]> {
  return {
    empty: () => [amonoid.empty(), bmonoid.empty()],
    concat: getProductSemigroup(amonoid, bmonoid).concat
  }
}

export function getDualMonoid<A>(monoid: Monoid<A>): Monoid<A> {
  return {
    empty: monoid.empty,
    concat: (x, y) => monoid.concat(y, x)
  }
}

// Boolean monoid under conjunction
export const all: Monoid<boolean> = {
  empty: () => true,
  concat: (x, y) => x && y
}

// Boolean monoid under disjunction
export const any: Monoid<boolean> = {
  empty: () => false,
  concat: (x, y) => x || y
}

// Monoid under addition
export const sum: Monoid<number> = {
  empty: () => 0,
  concat: (x, y) => x + y
}

// Monoid under multiplication
export const product: Monoid<number> = {
  empty: () => 1,
  concat: (x, y) => x * y
}

export const stringMonoid: Monoid<string> = {
  empty: () => '',
  concat: (x, y) => x + y
}

export const arrayMonoid: Monoid<Array<any>> = {
  empty: () => [],
  concat: (x, y) => x.concat(y)
}
