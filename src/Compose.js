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

class IsCompose<F, G> {} // eslint-disable-line no-unused-vars

export function prj<F, G, A>(fga: HKT<IsCompose<F, G>, A>): HKT<F, HKT<G, A>> {
  return ((fga: any): HKT<F, HKT<G, A>>)
}

export function inj<F, G, A>(fga: HKT<F, HKT<G, A>>): HKT<IsCompose<F, G>, A> {
  return ((fga: any): HKT<IsCompose<F, G>, A>)
}

export function composeFunctor<F, G>(f: Functor<F>, g: Functor<G>): Functor<IsCompose<F, G>> {

  function map<A, B>(h: (a: A) => B, fga: HKT<IsCompose<F, G>, A>): HKT<IsCompose<F, G>, B> {
    return inj(f.map(ga => g.map(h, ga), prj(fga)))
  }

  return {
    map
  }
}

export function composeApplicative<F, G>(f: Applicative<F>, g: Applicative<G>): Applicative<IsCompose<F, G>> {

  const { map } = composeFunctor(f, g)

  function ap<A, B>(fgab: HKT<IsCompose<F, G>, (a: A) => B>, fga: HKT<IsCompose<F, G>, A>): HKT<IsCompose<F, G>, B> {
    return inj(f.ap(f.map(h => ga => g.ap(h, ga), prj(fgab)), prj(fga)))
  }

  function of<A>(a: A): HKT<IsCompose<F, G>, A> {
    return inj(f.of(g.of(a)))
  }

  return {
    map,
    ap,
    of
  }
}

export function composeFoldable<F1, F2>(f1: Foldable<F1>, f2: Foldable<F2>): Foldable<IsCompose<F1, F2>> {

  function reduce<A, B>(f: (b: B, a: A) => B, b: B, fa: HKT<IsCompose<F1, F2>, A>): B {
    return f1.reduce((a, gb) => f2.reduce(f, a, gb), b, prj(fa))
  }

  return {
    reduce
  }
}

export function composeTraversable<T1, T2>(t1: Traversable<T1>, t2: Traversable<T2>): Traversable<IsCompose<T1, T2>> {

  function traverse<F, A, B>(applicative: Applicative<F>, f: (a: A) => HKT<F, B>, ta: HKT<IsCompose<T1, T2>, A>): HKT<F, HKT<IsCompose<T1, T2>, B>> {
    return applicative.map(inj, t1.traverse(applicative, t2a => t2.traverse(applicative, f, t2a), prj(ta)))
  }

  return {
    map: composeFunctor(t1, t2).map,
    reduce: composeFoldable(t1, t2).reduce,
    traverse
  }
}
