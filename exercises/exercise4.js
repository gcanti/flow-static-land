// @flow

/*

  Exercise 4

  Write a type safe head function.

*/
import type { Maybe } from '../src/Maybe'

export function head<A>(xs: Array<A>): Maybe<A> {
  throw 'not implemented'
}

/*

  Write a type safe elementAt function

*/
import type { Either } from '../src/Either'

export function elementAt<A>(xs: Array<A>, i: number): Either<string, A> {
  throw 'not implemented'
}
