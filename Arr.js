// @flow
import { HKT } from './HKT'
import type { Monoid } from './Monoid'
import type { Monad } from './Monad'
import type { Foldable } from './Foldable'
import type { Alt } from './Alt'

class Arr {}

export const t = Arr

function prj<A>(fa: HKT<Arr, A>): Array<A> {
  return ((fa: any): Array<A>)
}

export function inj<A>(a: Array<A>): HKT<Arr, A> {
  return ((a: any): HKT<Arr, A>)
}

export function empty<S>(): HKT<Arr, S> {
  return inj([])
}

export function concat<S>(a: HKT<Arr, S>, b: HKT<Arr, S>): HKT<Arr, S> {
  return inj(prj(a).concat(prj(b)))
}

export function map<A, B>(f: (a: A) => B, fa: HKT<Arr, A>): HKT<Arr, B> {
  return inj(prj(fa).map(f))
}

export function ap<A, B>(fab: HKT<Arr, (a: A) => B>, fa: HKT<Arr, A>): HKT<Arr, B> {
  return inj(prj(fab).reduce((acc, f) => acc.concat(prj(fa).map(f)), []))
}

export function of<A>(a: A): HKT<Arr, A> {
  return inj([a])
}

export function chain<A, B>(f: (a: A) => HKT<Arr, B>, fa: HKT<Arr, A>): HKT<Arr, B> {
  return inj(prj(fa).reduce((acc, a) => acc.concat(prj(f(a))), []))
}

export function reduce<A, B>(f: (a: A, b: B) => A, a: A, fb: HKT<Arr, B>): A {
  return prj(fb).reduce(f, a)
}

export const alt = concat

if (false) { // eslint-disable-line
  ({
    concat,
    empty,
    map,
    ap,
    of,
    chain,
    reduce,
    alt
  }: Monoid<HKT<Arr, *>> & Monad<Arr> & Foldable<Arr> & Alt<Arr>)
}
