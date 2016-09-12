// @flow
import type { Functor } from './Functor'
import type { Monad } from './Monad'
import type { HKT2 } from './HKT'

import { HKT } from './HKT'
import { Data1 } from './Data'

class IsFree {}

// we can think of a free monad as just being a list of functors

class Suspend<F, A> extends Data1<HKT<F, Free<F, A>>> {}

class Return<A> extends Data1<A> {}

export type FreeV<F, A> = Return<A> | Suspend<F, A>;

export type Free<F, A> = HKT2<IsFree, F, A>;

export function inj<F, A>(f: FreeV<F, A>): Free<F, A> {
  return ((f: any): Free<F, A>)
}

export function prj<F, A>(fa: Free<F, A>): FreeV<F, A> {
  return ((fa: any): FreeV<F, A>)
}

export function of<F, A>(a: A): Free<F, A> {
  return inj(new Return(a))
}

export function suspend<F, A>(ffa: HKT<F, Free<F, A>>): Free<F, A> {
  return inj(new Suspend(ffa))
}

export function liftFree<F, A>(functor: Functor<F>, fa: HKT<F, A>): Free<F, A> {
  return suspend(functor.map(of, fa))
}

export function foldFree<F, A>(functor: Functor<F>, join: (fa: HKT<F, A>) => A, ffa: Free<F, A>): A {
  const fa = prj(ffa)
  if (fa instanceof Return) {
    return fa.value0
  }
  return join(functor.map(x => foldFree(functor, join, x), fa.value0))
}

export function freeMonad<F>(functor: Functor<F>): Monad<HKT<IsFree, F>> {

  function map<A, B>(f: (a: A) => B, fa: Free<F, A>): Free<F, B> {
    const a = prj(fa)
    if (a instanceof Return) {
      return of(f(a.value0))
    }
    return suspend(functor.map(x => map(f, x), a.value0))
  }

  function ap<A, B>(fab: Free<F, (a: A) => B>, fa: Free<F, A>): Free<F, B> {
    return chain(f => map(f, fa), fab) // <= derived
  }

  function join<A>(ffa: Free<F, Free<F, A>>): Free<F, A> {
    const fa = prj(ffa)
    if (fa instanceof Return) {
      return fa.value0
    }
    return suspend(functor.map(join, fa.value0))
  }

  function chain<A, B>(f: (a: A) => Free<F, B>, fa: Free<F, A>): Free<F, B> {
    return join(map(f, fa)) // <= derived
  }

  return {
    map,
    ap,
    of,
    chain
  }

}
