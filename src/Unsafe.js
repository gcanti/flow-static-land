// @flow

export function unsafeCoerce<A, B>(a: A): B {
  return ((a: any): B)
}
