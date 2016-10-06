// @flow
import type { HKT2 } from './HKT'
import type { Tuple } from './Tuple'
import type { Monoid } from './Monoid'
import type { Monad } from './Monad'

import { HKT } from './HKT'
import * as tuple from './Tuple'

/*

  Example

  import type { Writer } from '../Writer'
  import * as writer from '../Writer'

  const stringMonoid = {
    empty: () => '',
    concat: (a, b) => [a, b].filter(Boolean).join(',')
  }

  function logNumber(n: number): Writer<string, number> {
    return writer.injWriter(n, 'Got number: ' + n)
  }

  function multWithLog(): Writer<string, number> {
    const a = logNumber(3)
    const b = logNumber(5)
    const m = writer.monadWriter(stringMonoid)
    return m.chain(a => {
      return m.chain(b => m.of(a * b), b)
    }, a)
  }

  writer.runWriter(multWithLog()) // => [15, "Got number: 3, Got number: 5, "]

*/

class IsWriter {}

export type WriterV<W, A> = () => Tuple<A, W>;

export type Writer<W, A> = HKT2<IsWriter, W, A>;

export function inj<W, A>(a: WriterV<W, A>): Writer<W, A> {
  return ((a: any): Writer<W, A>)
}

export function prj<W, A>(fa: Writer<W, A>): WriterV<W, A> {
  return ((fa: any): WriterV<W, A>)
}

export function runWriter<W, A>(w: Writer<W, A>): Tuple<A, W> {
  return prj(w)()
}

export function evalWriter<W, A>(w: Writer<W, A>): A {
  return tuple.fst(runWriter(w))
}

export function execWriter<W, A>(w: Writer<W, A>): W {
  return tuple.snd(runWriter(w))
}

export function writer<W, A>(t: Tuple<A, W>): Writer<W, A> {
  return inj(() => t)
}

export function injWriter<W, A>(a: A, w: W): Writer<W, A> {
  return writer(tuple.inj([a, w]))
}

export function tell<W>(w: W): Writer<W, void> {
  return inj(() => tuple.inj([undefined, w]))
}

// TODO: change to getMonad
export function monadWriter<W>(monoid: Monoid<W>): Monad<HKT<IsWriter, W>> {

  function map<A, B>(f: (a: A) => B, fa: Writer<W, A>): Writer<W, B> {
    return inj(() => {
      const [a, w] = tuple.prj(runWriter(fa))
      return tuple.inj([f(a), w])
    })
  }

  function ap<A, B>(fab: Writer<W, (a: A) => B>, fa: Writer<W, A>): Writer<W, B> {
    return chain((f) => map(f, fa), fab) // <= derived
  }

  function of<A>(a: A): Writer<W, A> {
    return inj(() => tuple.inj([a, monoid.empty()]))
  }

  function chain<A, B>(f: (a: A) => Writer<W, B>, fa: Writer<W, A>): Writer<W, B> {
    return inj(() => {
      const [a, w1] = tuple.prj(runWriter(fa))
      const [b, w2] = tuple.prj(runWriter(f(a)))
      return tuple.inj([b, monoid.concat(w1, w2)])
    })
  }

  return {
    map,
    ap,
    of,
    chain
  }

}
