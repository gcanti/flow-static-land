// @flow
import type { Semigroup } from './Semigroup'

export interface Monoid<A> extends Semigroup<A> {
  empty(): A
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
