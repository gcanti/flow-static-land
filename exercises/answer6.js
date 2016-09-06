// @flow

import type { Arr } from '../Arr'
import * as arr from '../Arr'
import * as maybe from '../Maybe'
import * as tuple from '../Tuple'

export function evens(count: number): Arr<number> {
  return arr.unfoldr(n => {
    if (count <= 0) {
      return maybe.Nothing
    }
    count--
    return maybe.of(tuple.inj([n, n + 2]))
  }, 1)
}

console.log(evens(10)) // => [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
