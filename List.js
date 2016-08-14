// @flow
import { HKT } from './HKT'
import type { Monad } from './Monad'
import type { Foldable } from './Foldable'

class List {}

export const t = List

function prj<A>(fa: HKT<List, A>): Array<A> {
  return ((fa: any): Array<A>)
}

export function inj<A>(a: Array<A>): HKT<List, A> {
  return ((a: any): HKT<List, A>)
}

export function map<A, B>(f: (a: A) => B, fa: HKT<List, A>): HKT<List, B> {
  return inj(prj(fa).map(f))
}

export function ap<A, B>(fab: HKT<List, (a: A) => B>, fa: HKT<List, A>): HKT<List, B> {
  const ab = prj(fab)
  const a = prj(fa)
  return inj(ab.reduce((acc, f) => acc.concat(a.map(f)), []))
}

export function of<A>(a: A): HKT<List, A> {
  return inj([a])
}

export function chain<A, B>(f: (a: A) => HKT<List, B>, fa: HKT<List, A>): HKT<List, B> {
  const a = prj(fa)
  return inj(a.map(f).reduce((acc, fb) => acc.concat(prj(fb)), []))
}

export function reduce<A, B>(f: (a: A, b: B) => A, a: A, fb: HKT<List, B>): A {
  const b = prj(fb)
  return b.reduce(f, a)
}

if (false) { // eslint-disable-line
  ({
    map,
    ap,
    of,
    chain,
    reduce
  }: Monad<List, *, *> & Foldable<List, *, *>)
}
