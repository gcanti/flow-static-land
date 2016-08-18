// @flow
import type { Setoid } from './Setoid'
import type { Ordering } from './Ordering'

export interface Ord<A> extends Setoid<A> {
  compare(x: A, y: A): Ordering
}

export function compare<A>(dictOrd: Ord<A>, x: A, y: A): Ordering {
  return dictOrd.compare(x, y)
}

export function unsafeCompare(x: any, y: any): Ordering {
  return x < y ? 'LT' : x > y ? 'GT' : 'EQ'
}

export const ordBoolean = {
  compare: unsafeCompare
}

export const ordNumber = {
  compare: unsafeCompare
}

export const ordString = {
  compare: unsafeCompare
}

export function lessThan<A>(dictOrd: Ord<A>, x: A, y: A): boolean {
  return dictOrd.compare(x, y) === 'LT'
}

export function greaterThan<A>(dictOrd: Ord<A>, x: A, y: A): boolean {
  return dictOrd.compare(x, y) === 'GT'
}

export function lessThanOrEq<A>(dictOrd: Ord<A>, x: A, y: A): boolean {
  return dictOrd.compare(x, y) !== 'GT'
}

export function greaterThanOrEq<A>(dictOrd: Ord<A>, x: A, y: A): boolean {
  return dictOrd.compare(x, y) !== 'LT'
}

export function min<A>(dictOrd: Ord<A>, x: A, y: A): A {
  return dictOrd.compare(x, y) === 'GT' ? y : x
}

export function max<A>(dictOrd: Ord<A>, x: A, y: A): A {
  return dictOrd.compare(x, y) === 'LT' ? y : x
}

export function clamp<A>(dictOrd: Ord<A>, low: A, hi: A, x: A): A {
  return min(dictOrd, hi, max(dictOrd, low, x))
}

export function between<A>(dictOrd: Ord<A>, low: A, hi: A, x: A): boolean {
  return lessThan(dictOrd, x, low) || greaterThan(dictOrd, x, hi) ? false : true
}
