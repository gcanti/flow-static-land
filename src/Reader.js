// @flow
import type { HKT2 } from './HKT'
import type { Monad } from './Monad'

import { HKT } from './HKT'
import { compose } from './Fun'
import { id } from './Identity'

class IsReader {}

export type ReaderV<E, A> = (e: E) => A;

export type Reader<E, A> = HKT2<IsReader, E, A>;

export function inj<E, A>(a: ReaderV<E, A>): Reader<E, A> {
  return ((a: any): Reader<E, A>)
}

export function prj<E, A>(fa: Reader<E, A>): ReaderV<E, A> {
  return ((fa: any): ReaderV<E, A>)
}

export function runReader<E, A>(r: Reader<E, A>, e: E): A {
  return prj(r)(e)
}

// reads the current context
export function ask<E>(): Reader<E, E> {
  return inj(id)
}

export const asks = inj

// changes the value of the local context during the execution of the action `fa`
export function local<E, A>(f: (e: E) => E, fa: Reader<E, A>): Reader<E, A> {
  return inj((e) => runReader(fa, f(e)))
}

export function map<E, A, B>(f: (a: A) => B, fa: Reader<E, A>): Reader<E, B> {
  return inj(compose(f, prj(fa)))
}

export function ap<E, A, B>(fab: Reader<E, (a: A) => B>, fa: Reader<E, A>): Reader<E, B> {
  return chain((f) => map(f, fa), fab) // <= derived
}

export function of<E, A>(a: A): Reader<E, A> {
  return inj(() => a)
}

export function chain<E, A, B>(f: (a: A) => Reader<E, B>, fa: Reader<E, A>): Reader<E, B> {
  return inj((e) => prj(f(runReader(fa, e)))(e))
}

if (false) { // eslint-disable-line
  ({
    map,
    ap,
    of,
    chain
  }: Monad<HKT<IsReader, *>>)
}
