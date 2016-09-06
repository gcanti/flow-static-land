// @flow

import type { Maybe } from '../Maybe'
import * as maybe from '../Maybe'

import type { Arr } from '../Arr'
import * as arr from '../Arr'

export function getAllJustsOrNothing<A>(xs: Arr<Maybe<A>>): Maybe<Arr<A>> {
  return arr.sequence(maybe, xs)
}

console.log(getAllJustsOrNothing(arr.inj([maybe.of(1), maybe.of(2), maybe.of(3)]))) // => Just([1, 2, 3])
console.log(getAllJustsOrNothing(arr.inj([maybe.of(1), maybe.Nothing, maybe.of(3)]))) // => Nothing
