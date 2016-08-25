// @flow

import * as maybe from '../Maybe'
import * as arr from '../Arr'

const f = (n) => n * 2
const g = (n) => n + 1

console.log(maybe.map(f, maybe.Nothing)) // => null
console.log(maybe.map(f, maybe.of(3))) // => 6

console.log(arr.ap(arr.inj([f, g]), arr.inj([1, 2, 3]))) // => [2, 4, 6, 2, 3, 4]

// maybe.map(f, maybe.of('s')) // <= uncomment this to see flow errors
