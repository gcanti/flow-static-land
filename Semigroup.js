// @flow
export interface Semigroup<A> {
  concat(a: A, b: A): A
}

export function concat<A>(dictSemigroup: Semigroup<A>, a: A, b: A): A {
  return dictSemigroup.concat(a, b)
}
