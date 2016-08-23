// @flow
import { HKT } from './HKT'
import type { Maybe } from './Maybe'
import * as maybe from './Maybe'
import type { Tuple } from './Tuple'
import { inj } from './Tuple'
import type { Applicative } from './Applicative'
import type { Traversable } from './Traversable'
import { constant } from './Fun'
import { unit } from './Unit'

// This class identifies data structures which can be _unfolded_,
// generalizing `unfoldr` on arrays.
export interface Unfoldable<T> {
  unfoldr<A, B>(f: (b: B) => Maybe<Tuple<A, B>>, b: B): HKT<T, A>
}

// Replicate a value some natural number of times.
export function unfoldr<T, A, B>(dictUnfoldable: Unfoldable<T>, f: (b: B) => Maybe<Tuple<A, B>>, b: B): HKT<T, A> {
  return dictUnfoldable.unfoldr(f, b)
}

export function replicate<T, A>(dictUnfoldable: Unfoldable<T>, n: number, a: A): HKT<T, A> {
  const step = (n: number): Maybe<Tuple<A, number>> => {
    return n <= 0 ? maybe.Nothing : maybe.of(inj([a, n - 1]))
  }
  return unfoldr(dictUnfoldable, step, n)
}

// Perform an Applicative action `n` times, and accumulate all the results.
export function replicateA<M, F, A>(dictApplicative: Applicative<M>, dictUnfoldableTraverable: Unfoldable<F> & Traversable<F>, n: number, ma: HKT<M, A>): HKT<M, HKT<F, A>> {
  return dictUnfoldableTraverable.sequence(dictApplicative, replicate(dictUnfoldableTraverable, n, ma))
}

// The container with no elements - unfolded with zero iterations.
export function none<F, A>(dictUnfoldable: Unfoldable<F>): HKT<F, A> {
  return unfoldr(dictUnfoldable, constant(maybe.Nothing), unit)
}

export function  singleton<F, A>(dictUnfoldable: Unfoldable<F>, a: A): HKT<F, A> {
  return replicate(dictUnfoldable, 1, a)
}
