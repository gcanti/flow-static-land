// @flow
import { HKT } from './HKT'
import type { Monoid } from './Monoid'
import type { Monad } from './Monad'
import type { Foldable } from './Foldable'
import type { Alt } from './Alt'
import type { Plus } from './Plus'
import type { Alternative } from './Alternative'
import type { Setoid } from './Setoid'

class IsArr {}

export type Arr<A> = HKT<IsArr, A>;

export function prj<A>(fa: Arr<A>): Array<A> {
  return ((fa: any): Array<A>)
}

export function inj<A>(a: Array<A>): Arr<A> {
  return ((a: any): Arr<A>)
}

export function empty<A>(): Arr<A> {
  return inj([])
}

export const pempty = empty

export function concat<A>(a: Arr<A>, b: Arr<A>): Arr<A> {
  return inj(prj(a).concat(prj(b)))
}

export function map<A, B>(f: (a: A) => B, fa: Arr<A>): Arr<B> {
  return inj(prj(fa).map(f))
}

export function ap<A, B>(fab: Arr<(a: A) => B>, fa: Arr<A>): Arr<B> {
  return inj(prj(fab).reduce((acc, f) => acc.concat(prj(fa).map(f)), []))
}

export function of<A>(a: A): Arr<A> {
  return inj([a])
}

export function chain<A, B>(f: (a: A) => Arr<B>, fa: Arr<A>): Arr<B> {
  return inj(prj(fa).reduce((acc, a) => acc.concat(prj(f(a))), []))
}

export function reduce<A, B>(f: (a: A, b: B) => A, a: A, fb: Arr<B>): A {
  return prj(fb).reduce(f, a)
}

export const alt = concat

export function equals<A>(dictSetoid: Setoid<A>, fx: Arr<A>, fy: Arr<A>): boolean {
  const x = prj(fx)
  const y = prj(fy)
  if (x.length !== y.length) {
    return false
  }
  for (var i = 0, len = x.length; i < len; i++) {
    if (!dictSetoid.equals(x[i], y[i])) {
      return false
    }
  }
  return true
}

export function getSetoid<A>(dictSetoid: Setoid<A>): Setoid<Arr<A>> {
  return {
    equals(fx, fy) {
      return equals(dictSetoid, fx, fy)
    }
  }
}

if (false) { // eslint-disable-line
  ({
    concat,
    empty,
    map,
    ap,
    of,
    chain,
    reduce,
    alt,
    pempty
  }: Monoid<Arr<*>> & Monad<IsArr> & Foldable<IsArr> & Alt<IsArr> & Plus<IsArr> & Alternative<IsArr>)
}
