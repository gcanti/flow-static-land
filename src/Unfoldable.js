// @flow
import type { Maybe } from './Maybe'
import type { Applicative } from './Applicative'
import type { Traversable } from './Traversable'
import type { Tuple } from './Tuple'

import { HKT } from './HKT'
import * as maybe from './Maybe'
import { inj } from './Tuple'
import { sequence } from './Traversable'
import { constant } from './Fun'

// This class identifies data structures which can be _unfolded_,
// generalizing `unfoldr` on arrays.
export interface Unfoldable<T> {
  unfoldr<A, B>(f: (b: B) => Maybe<Tuple<A, B>>, b: B): HKT<T, A>
}

// Replicate a value some natural number of times.
export function replicate<T, A>(unfoldable: Unfoldable<T>, n: number, a: A): HKT<T, A> {
  function step(n: number): Maybe<Tuple<A, number>> {
    return n <= 0 ? maybe.Nothing : maybe.of(inj([a, n - 1]))
  }
  return unfoldable.unfoldr(step, n)
}

// Perform an Applicative action `n` times, and accumulate all the results.
export function replicateA<M, F, A>(
    applicative: Applicative<M>,
    unfoldableTraversable: Unfoldable<F> & Traversable<F>,
    n: number,
    ma: HKT<M, A>
  ): HKT<M, HKT<F, A>> {
  return sequence(applicative, unfoldableTraversable, replicate(unfoldableTraversable, n, ma))
}

// The container with no elements - unfolded with zero iterations.
export function none<F, A>(unfoldable: Unfoldable<F>): HKT<F, A> {
  return unfoldable.unfoldr(constant(maybe.Nothing), undefined)
}

export function singleton<F, A>(unfoldable: Unfoldable<F>, a: A): HKT<F, A> {
  return replicate(unfoldable, 1, a)
}
