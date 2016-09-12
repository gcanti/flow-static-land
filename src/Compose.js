// @flow
import type { Functor } from './Functor'
import type { Applicative } from './Applicative'
import type { Foldable } from './Foldable'
import type { Traversable } from './Traversable'

/*

  Functor, Applicative, Foldable, and Traversable are all closed under composition
  (Monad is not)

*/

import { HKT } from './HKT'

class Compose<F, G> {} // eslint-disable-line no-unused-vars

export function prj<F, G, A>(fga: HKT<Compose<F, G>, A>): HKT<F, HKT<G, A>> {
  return ((fga: any): HKT<F, HKT<G, A>>)
}

export function inj<F, G, A>(fga: HKT<F, HKT<G, A>>): HKT<Compose<F, G>, A> {
  return ((fga: any): HKT<Compose<F, G>, A>)
}

export function composeFunctor<F, G>(f: Functor<F>, g: Functor<G>): Functor<Compose<F, G>> {

  function map<A, B>(h: (a: A) => B, fga: HKT<Compose<F, G>, A>): HKT<Compose<F, G>, B> {
    return inj(f.map(ga => g.map(h, ga), prj(fga)))
  }

  return {
    map
  }
}

export function composeApplicative<F, G>(f: Applicative<F>, g: Applicative<G>): Applicative<Compose<F, G>> {

  const { map } = composeFunctor(f, g)

  function ap<A, B>(fgab: HKT<Compose<F, G>, (a: A) => B>, fga: HKT<Compose<F, G>, A>): HKT<Compose<F, G>, B> {
    return inj(f.ap(f.map(h => ga => g.ap(h, ga), prj(fgab)), prj(fga)))
  }

  function of<A>(a: A): HKT<Compose<F, G>, A> {
    return inj(f.of(g.of(a)))
  }

  return {
    map,
    ap,
    of
  }
}

export function composeFoldable<F1, F2>(f1: Foldable<F1>, f2: Foldable<F2>): Foldable<Compose<F1, F2>> {

  function reduce<A, B>(f: (a: A, b: B) => A, a: A, fb: HKT<Compose<F1, F2>, B>): A {
    return f1.reduce((a, gb) => f2.reduce(f, a, gb), a, prj(fb))
  }

  return {
    reduce
  }
}

export function composeTraversable<T1, T2>(t1: Traversable<T1>, t2: Traversable<T2>): Traversable<Compose<T1, T2>> {

  function sequence<F, A>(applicative: Applicative<F>, tfa: HKT<Compose<T1, T2>, HKT<F, A>>): HKT<F, HKT<Compose<T1, T2>, A>> {
    return applicative.map(inj, t1.sequence(applicative, t1.map(t2fa => t2.sequence(applicative, t2fa), prj(tfa))))
  }

  return {
    map: composeFunctor(t1, t2).map,
    reduce: composeFoldable(t1, t2).reduce,
    sequence
  }
}
