// @flow

import { HKT } from '../src/HKT'
import type { Functor } from '../src/Functor'

class IsList {}

class Cons<A> {
  head: A;
  tail: ListV<A>;
  constructor(head: A, tail: ListV<A>) {
    this.head = head
    this.tail = tail
  }
}

const Nil: List<any> = inj(null)

type ListV<A> = null | Cons<A>;

export type List<A> = HKT<IsList, A>;

export function inj<A>(a: ListV<A>): List<A> {
  return ((a: any): List<A>)
}

export function prj<A>(fa: List<A>): ListV<A> {
  return ((fa: any): ListV<A>)
}

export function map<A, B>(f: (a: A) => B, fa: List<A>): List<B> {
  const a = prj(fa)
  if (a === null) {
    return Nil
  }
  return inj(new Cons(f(a.head), prj(map(f, inj(a.tail)))))
}

// let's prove it
({ map }: Functor<IsList>)

const x = inj(new Cons(1, new Cons(2, null)))

console.log(map(n => n * 2, x)) // => Cons(2, Cons(4, null))
