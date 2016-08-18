// @flow
export interface Setoid<A> {
  equals(x: A, y: A): boolean
}

export function equals<A>(dictSetoid: Setoid<A>, x: A, y: A): boolean {
  return dictSetoid.equals(x, y)
}
