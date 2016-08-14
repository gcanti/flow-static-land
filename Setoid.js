// @flow
export interface Setoid<S> {
  equals(a: S, b: S): boolean
}

export function equals<S>(setoid: Setoid<S>, a: S, b: S): boolean {
  return setoid.equals(a, b)
}
