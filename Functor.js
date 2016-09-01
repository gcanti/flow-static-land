// @flow
import { HKT } from './HKT'

export interface Functor<F> {
  map<A, B>(f: (a: A) => B, fa: HKT<F, A>): HKT<F, B>
}

export function lift<F, A, B>(functor: Functor<F>, f: (a: A) => B): (fa: HKT<F, A>) => HKT<F, B> {
  return fa => functor.map(f, fa)
}

class Compose<F, G> {} // eslint-disable-line no-unused-vars

export function compose<F, G, FG: Compose<F, G>>(f: Functor<F>, g: Functor<G>): Functor<FG> {

  function prj<A>(fga: HKT<FG, A>): HKT<F, HKT<G, A>> {
    return ((fga: any): HKT<F, HKT<G, A>>)
  }

  function inj<A>(fga: HKT<F, HKT<G, A>>): HKT<FG, A> {
    return ((fga: any): HKT<FG, A>)
  }

  function map<A, B>(h: (a: A) => B, fga: HKT<FG, A>): HKT<FG, B> {
    return inj(f.map(ga => g.map(h, ga), prj(fga)))
  }

  return {
    inj,
    prj,
    map
  }
}
