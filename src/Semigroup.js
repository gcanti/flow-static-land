// @flow
export interface Semigroup<A> {
  concat(x: A, y: A): A
}

export function getProductSemigroup<A, B>(asemigroup: Semigroup<A>, bsemigroup: Semigroup<B>): Semigroup<[A, B]> {
  return {
    concat([xa, xb], [ya, yb]) {
      return [
        asemigroup.concat(xa, ya),
        bsemigroup.concat(xb, yb)
      ]
    }
  }
}
