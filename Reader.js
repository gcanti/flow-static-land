// @flow
import { HKT } from './HKT'
import type { HKT2 } from './HKT'
import { compose } from './Fun'
import { id } from './Identity'
import type { Monad } from './Monad'

class IsReader {}

export type ReaderV<R, A> = (r: R) => A;
export type Reader<R, A> = HKT2<IsReader, R, A>;

export function inj<R, A>(a: ReaderV<R, A>): Reader<R, A> {
  return ((a: any): Reader<R, A>)
}

export function prj<R, A>(fa: Reader<R, A>): ReaderV<R, A> {
  return ((fa: any): ReaderV<R, A>)
}

export const runReader = prj

// reads the current context
export function ask<R>(): Reader<R, R> {
  return inj(id)
}

// changes the value of the local context during the execution of the action `fa`
export function local<R, A>(f: (r: R) => R, fa: Reader<R, A>): Reader<R, A> {
  return inj((r) => prj(fa)(f(r)))
}

export function map<R, A, B>(f: (a: A) => B, fa: Reader<R, A>): Reader<R, B> {
  return inj(compose(f, prj(fa)))
}

export function ap<R, A, B>(fab: Reader<R, (a: A) => B>, fa: Reader<R, A>): Reader<R, B> {
  return chain((f) => map(f, fa), fab) // <= derived
}

export function of<R, A>(a: A): Reader<R, A> {
  return inj(() => a)
}

export function chain<R, A, B>(f: (a: A) => Reader<R, B>, fa: Reader<R, A>): Reader<R, B> {
  return inj((r) => prj(f(prj(fa)(r)))(r))
}

if (false) { // eslint-disable-line
  ({
    map,
    ap,
    of,
    chain
  }: Monad<HKT<IsReader, *>>)
}
