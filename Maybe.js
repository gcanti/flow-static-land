// @flow
import { HKT } from './HKT'
import type { Monad } from './Monad'
import type { Foldable } from './Foldable'

class Maybe {}

export const t = Maybe

function prj<A>(fa: HKT<Maybe, A>): A {
  return ((fa: any): A)
}

function inj<A>(a: A): HKT<Maybe, A> {
  return ((a: any): HKT<Maybe, A>)
}

export function map<A, B>(f: (a: A) => B, fa: HKT<Maybe, A>): HKT<Maybe, B> {
  const a = prj(fa)
  return a != null ? inj(f(a)) : Nothing
}

export function ap<A, B>(fab: HKT<Maybe, (a: A) => B>, fa: HKT<Maybe, A>): HKT<Maybe, B> {
  const ab = prj(fab)
  if (ab == null) {
    return Nothing
  }
  return map(ab, fa)
}

export function of<A>(a: A): HKT<Maybe, A> {
  return inj(a)
}

export function chain<A, B>(f: (a: A) => HKT<Maybe, B>, fa: HKT<Maybe, A>): HKT<Maybe, B> {
  const a = prj(fa)
  if (a == null) {
    return Nothing
  }
  return f(a)
}

export const Nothing: HKT<Maybe, any> = inj(null)

export function reduce<A, B>(f: (a: A, b: B) => A, a: A, fb: HKT<Maybe, B>): A {
  const b = prj(fb)
  return b != null ? f(a, b) : a
}

if (false) { // eslint-disable-line
  ({
    map,
    ap,
    of,
    chain,
    reduce
  }: Monad<Maybe, *, *> & Foldable<Maybe, *, *>)
}
