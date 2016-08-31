// @flow
import type { Semigroup } from './Semigroup'

export interface Monoid<A> extends Semigroup<A> {
  empty(): A
}

export const booleanAndMonoid: Monoid<boolean> = {
  empty: () => true,
  concat: (x, y) => x && y
}

export const booleanOrMonoid: Monoid<boolean> = {
  empty: () => false,
  concat: (x, y) => x || y
}

export const numberAdditionMonoid: Monoid<number> = {
  empty: () => 0,
  concat: (x, y) => x + y
}

export const numberProductMonoid: Monoid<number> = {
  empty: () => 1,
  concat: (x, y) => x * y
}

export const stringMonoid: Monoid<string> = {
  empty: () => '',
  concat: (x, y) => x + y
}
