// @flow
export interface Semigroup<A> {
  concat(x: A, y: A): A
}

export function concat<A>(dictSemigroup: Semigroup<A>, x: A, y: A): A {
  return dictSemigroup.concat(x, y)
}
