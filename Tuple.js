// @flow
import { HKT } from './HKT'
import type { HKT2 } from './HKT'
import type { Semigroupoid } from './Semigroupoid'
import type { Functor } from './Functor'
import type { Bifunctor } from './Bifunctor'
import type { Extend } from './Extend'
import type { Comonad } from './Comonad'

class IsTuple {}

export type TupleV<A, B> = [A, B];

export type Tuple<A, B> = HKT2<IsTuple, A, B>;

export function inj<A, B>(t: TupleV<A, B>): Tuple<A, B> {
  return ((t: any): Tuple<A, B>)
}

export function prj<A, B>(ft: Tuple<A, B>): TupleV<A, B> {
  return ((ft: any): TupleV<A, B>)
}

export function fst<A, B>(t: Tuple<A, B>): A {
  return prj(t)[0]
}

export function snd<A, B>(t: Tuple<A, B>): B {
  return prj(t)[1]
}

export function compose<A, B, C>(x: Tuple<B, C>, y: Tuple<A, B>): Tuple<A, C> {
  return inj([fst(y), snd(x)])
}

export function map<A, B, C>(f: (a: A) => B, fa: Tuple<C, A>): Tuple<C, B> {
  const a = prj(fa)
  return inj([a[0], f(a[1])])
}

export function bimap<A, B, C, D>(f: (a: A) => B, g: (c: C) => D, fac: Tuple<A, C>): Tuple<B, D> {
  const ac = prj(fac)
  return inj([f(ac[0]), g(ac[1])])
}

export function extend<X, A, B>(f: (ea: Tuple<X, A>) => B, ea: Tuple<X, A>): Tuple<X, B> {
  const t = prj(ea)
  return inj([t[0], f(ea)])
}

export const extract = snd

if (false) { // eslint-disable-line
  ({
    map,
    compose,
    bimap,
    extend,
    extract
  }: Semigroupoid<IsTuple> &
     Functor<HKT<IsTuple, *>> &
     Bifunctor<IsTuple> &
     Extend<HKT<IsTuple, *>> &
     Comonad<HKT<IsTuple, *>>)
}
