// @flow
import { HKT } from './HKT'
import type { Monoid } from './Monoid'
import type { Monad } from './Monad'
import type { Foldable } from './Foldable'
import type { Alt } from './Alt'
import type { Plus } from './Plus'
import type { Alternative } from './Alternative'
import type { Setoid } from './Setoid'
import type { Maybe } from './Maybe'
import * as maybe from './Maybe'
import { id } from './Identity'
import type { Predicate } from './Fun'
import type { Ord } from './Ord'
import { toNativeComparator } from './Ord'

class IsArr {}

export type Arr<A> = HKT<IsArr, A>;

export function inj<A>(a: Array<A>): Arr<A> {
  return ((a: any): Arr<A>)
}

export function prj<A>(fa: Arr<A>): Array<A> {
  return ((fa: any): Array<A>)
}

function copy<A>(as: Arr<A>): Array<A> {
  return prj(as).slice()
}

export function empty<A>(): Arr<A> {
  return inj([])
}

export const pempty = empty

export function concat<A>(x: Arr<A>, y: Arr<A>): Arr<A> {
  return inj(prj(x).concat(prj(y)))
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

export function uncons<A, B>(as: Arr<A>, empty: () => B, otherwise: (head: A, tail: Arr<A>) => B): B {
  const xs = prj(as)
  return xs.length === 0 ? empty() : otherwise(xs[0], inj(xs.slice(1)))
}

export function length<A>(as: Arr<A>): number {
  return prj(as).length
}

export function isEmpty<A>(as: Arr<A>): boolean {
  return length(as) === 0
}

export function isOutOfBound<A>(i: number, as: Arr<A>): boolean {
  return i < 0 || i >= prj(as).length
}

export function index<A>(as: Arr<A>, i: number): Maybe<A> {
  const xs = prj(as)
  return isOutOfBound(i, as) ? maybe.Nothing : maybe.of(xs[i])
}

export function cons<A>(a: A, as: Arr<A>): Arr<A> {
  return inj([a].concat(prj(as)))
}

export function snoc<A>(as: Arr<A>, a: A): Arr<A> {
  return inj(prj(as).concat(a))
}

export function head<A>(as: Arr<A>): Maybe<A> {
  return isEmpty(as) ? maybe.Nothing : maybe.of(prj(as)[0])
}

export function last<A>(as: Arr<A>): Maybe<A> {
  return index(as, length(as) - 1)
}

export function tail<A>(as: Arr<A>): Maybe<Arr<A>> {
  const xs = prj(as)
  const len = xs.length
  return len === 0 ? maybe.Nothing : maybe.of(inj(xs.slice(1)))
}

export function slice<A>(start: number, end: number, as: Arr<A>): Arr<A> {
  return inj(prj(as).slice(start, end))
}

export function init<A>(as: Arr<A>): Maybe<Arr<A>> {
  const xs = prj(as)
  const len = xs.length
  return len === 0 ? maybe.Nothing : maybe.of(inj(xs.slice(0, len - 1)))
}

export function take<A>(n: number, as: Arr<A>): Arr<A> {
  return slice(0, n, as)
}

export function takeWhile<A>(predicate: Predicate<A>, as: Arr<A>): Arr<A> {
  return inj(prj(as).slice().filter(predicate))
}

export function drop<A>(n: number, as: Arr<A>): Arr<A> {
  return slice(n, length(as), as)
}

export function dropWhile<A>(predicate: Predicate<A>, as: Arr<A>): Arr<A> {
  return takeWhile((a) => !predicate(a), as)
}

export function findIndex<A>(predicate: Predicate<A>, as: Arr<A>): Maybe<number> {
  const xs = prj(as)
  for (let i = 0, len = xs.length; i < len; i++) {
    if (predicate(xs[i])) {
      return maybe.of(i)
    }
  }
  return maybe.Nothing
}

export function filter<A>(predicate: (a: A) => boolean, as: Arr<A>): Arr<A> {
  return inj(prj(as).filter(predicate))
}

export function unsafeInsertAt<A>(i: number, a: A, as: Arr<A>): Arr<A> {
  const xs = copy(as)
  xs.splice(i, 0, a)
  return inj(xs)
}

export function insertAt<A>(i: number, a: A, as: Arr<A>): Maybe<Arr<A>> {
  return i < 0 || i > prj(as).length ? maybe.Nothing : maybe.of(unsafeInsertAt(i, a, as))
}

export function unsafeUpdateAt<A>(i: number, a: A, as: Arr<A>): Arr<A> {
  const xs = copy(as)
  xs[i] = a
  return inj(xs)
}

export function updateAt<A>(i: number, a: A, as: Arr<A>): Maybe<Arr<A>> {
  return isOutOfBound(i, as) ? maybe.Nothing : maybe.of(unsafeUpdateAt(i, a, as))
}

export function unsafeDeleteAt<A>(i: number, as: Arr<A>): Arr<A> {
  const xs = copy(as)
  xs.splice(i, 1)
  return inj(xs)
}

export function deleteAt<A>(i: number, as: Arr<A>): Maybe<Arr<A>> {
  return isOutOfBound(i, as) ? maybe.Nothing : maybe.of(unsafeDeleteAt(i, as))
}

export function modifyAt<A>(i: number, f: (a: A) => A, as: Arr<A>): Maybe<Arr<A>> {
  return isOutOfBound(i, as) ? maybe.Nothing : updateAt(i, f(prj(as)[i]), as)
}

export function reverse<A>(as: Arr<A>): Arr<A> {
  return inj(copy(as).reverse())
}

export function mapMaybe<A, B>(f: (a: A) => Maybe<B>, as: Arr<A>): Arr<B> {
  return chain((a: A): Arr<B> => maybe.maybe(empty(), of, f(a)), as)
}

export function catMaybes<A>(as: Arr<Maybe<A>>): Arr<A> {
  return mapMaybe(id, as)
}

export function sort<A>(dictOrd: Ord<A>, as: Arr<A>): Arr<A> {
  return inj(copy(as).sort(toNativeComparator(dictOrd.compare)))
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
  }: Monoid<Arr<*>> &
     Monad<IsArr> &
     Foldable<IsArr> &
     Alt<IsArr> &
     Plus<IsArr> &
     Alternative<IsArr>)
}
