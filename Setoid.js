// @flow
export interface Setoid<S> {
  equals(a: S, b: S): boolean
}

export function equals<S>(dictSetoid: Setoid<S>, a: S, b: S): boolean {
  return dictSetoid.equals(a, b)
}
