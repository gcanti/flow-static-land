// @flow

import { HKT } from '../HKT'
import type { Functor } from '../Functor'

class IsList {}

class Cons<A> {
  head: A;
  tail: List<A>;
  constructor(head: A, tail: List<A>) {
    this.head = head
    this.tail = tail
  }
}

const Nil = inj(null)

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
  return inj(a === null ? null : new Cons(f(a.head), map(f, a.tail)))
}

// let's prove it
({ map }: Functor<IsList>)

const x = new Cons(1, new Cons(2, Nil))

console.log(map(n => n * 2, x)) // => Cons(2, Cons(4, null))
