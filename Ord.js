// @flow
import type { Setoid } from './Setoid'
import type { Ordering } from './Ordering'
import {
  setoidBoolean,
  setoidNumber,
  setoidString
} from './Setoid'

export type Comparator<A> = (x: A, y: A) => Ordering;

export type NativeComparator<A> = (x: A, y: A) => number;

export interface Ord<A> extends Setoid<A> {
  compare(x: A, y: A): Ordering
}

export function toNativeComparator<A>(compare: Comparator<A>): NativeComparator<A> {
  return (x, y) => {
    const c = compare(x, y)
    return c === 'GT' ? 1 : c === 'EQ' ? 0 : -1
  }
}

export function compare<A>(dictOrd: Ord<A>, x: A, y: A): Ordering {
  return dictOrd.compare(x, y)
}

export function unsafeCompare(x: any, y: any): Ordering {
  return x < y ? 'LT' : x > y ? 'GT' : 'EQ'
}

export const ordBoolean: Ord<boolean> = Object.assign({}, {
  compare: unsafeCompare
}, setoidBoolean)

export const ordNumber: Ord<number> = Object.assign({}, {
  compare: unsafeCompare
}, setoidNumber)

export const ordString: Ord<string> = Object.assign({}, {
  compare: unsafeCompare
}, setoidString)

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
