// @flow
import type { Eff } from './Eff'
import { inj, map } from './Eff'

// The `RANDOM` effect indicates that an Eff action may access or modify the
// JavaScript global random number generator, i.e. `Math.random()`.
export class RANDOM {}

export function random<E>(): Eff<E & { random: RANDOM }, number> {
  return inj(() => Math.random())
}

// Returns a random integer between min (included) and max (included)
export function randomInt<E>(min: number, max: number): Eff<E & { random: RANDOM }, number> {
  const lo = Math.ceil(min)
  const hi = Math.floor(max)
  return map(n => Math.floor(n * (hi - lo + 1)) + lo, random())
}

// Returns a random number between a minimum value (inclusive) and a maximum value (exclusive)
export function randomRange<E>(min: number, max: number): Eff<E & { random: RANDOM }, number> {
  return map(n => Math.floor(n * (max - min)) + min, random())
}

// Returns a random boolean value with an equal chance of being `true` or `false`
export function randomBool<E>(): Eff<E & { random: RANDOM }, boolean> {
  return map(n => n < 0.5, random())
}
