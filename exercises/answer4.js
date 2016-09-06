// @flow

import type { Maybe } from '../Maybe'
import * as maybe from '../Maybe'

export function head<A>(xs: Array<A>): Maybe<A> {
  if (xs.length) {
    return maybe.of(xs[0])
  }
  return maybe.Nothing
}

console.log(head([1, 2, 3])) // => 1
console.log(head([])) // => null

import type { Either } from '../Either'
import * as either from '../Either'

export function elementAt<A>(xs: Array<A>, i: number): Either<string, A> {
  if (i < 0) {
    return either.left('out of lower bound')
  }
  if (i >= xs.length) {
    return either.left('out of upper bound')
  }
  return either.right(xs[i])
}

console.log(elementAt([1, 2, 3], -1)) // => Left('out of lower bound')
console.log(elementAt([1, 2, 3], 10)) // => Left('out of upper bound')
console.log(elementAt([1, 2, 3], 1))  // => Right(2)
