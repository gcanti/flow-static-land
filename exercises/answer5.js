// @flow

import type { Maybe } from '../src/Maybe'
import * as maybe from '../src/Maybe'
import { sequence } from '../src/Traversable'

import type { Arr } from '../src/Arr'
import * as arr from '../src/Arr'

export function getAllJustsOrNothing<A>(xs: Arr<Maybe<A>>): Maybe<Arr<A>> {
  return sequence(maybe, arr, xs)
}

console.log(getAllJustsOrNothing(arr.inj([maybe.of(1), maybe.of(2), maybe.of(3)]))) // => Just([1, 2, 3])
console.log(getAllJustsOrNothing(arr.inj([maybe.of(1), maybe.Nothing, maybe.of(3)]))) // => Nothing
