// @flow
export interface Semigroup<S> {
  concat(a: S, b: S): S
}

export function concat<S>(dictSemigroup: Semigroup<S>, a: S, b: S): S {
  return dictSemigroup.concat(a, b)
}
