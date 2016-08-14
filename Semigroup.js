// @flow
export interface Semigroup<S> {
  concat(a: S, b: S): S
}

export function concat<S>(semigroup: Semigroup<S>, a: S, b: S): S {
  return semigroup.concat(a, b)
}
