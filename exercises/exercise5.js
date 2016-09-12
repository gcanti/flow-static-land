// @flow

/*

  Exercise 5

  Write a function getAllJustsOrNothing, that combines a list of Justs into one maybe containing
  a list of all the Just values in the original list. If the original list contains Nothing
  even once, the result of the function should be Nothing, otherwise the result should be
  Just with a list of all the values

*/
import type { Arr } from '../src/Arr'
import type { Maybe } from '../src/Maybe'

export function getAllJustsOrNothing<A>(xs: Arr<Maybe<A>>): Maybe<Arr<A>> {
  throw 'not implemented'
}
