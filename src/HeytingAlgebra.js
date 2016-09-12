// @flow

/*

  The `HeytingAlgebra` type class represents types are bounded lattices with
  an implication operator such that the following laws hold:

  - Associativity:
    - `a || (b || c) = (a || b) || c`
    - `a && (b && c) = (a && b) && c`
  - Commutativity:
    - `a || b = b || a`
    - `a && b = b && a`
  - Absorption:
    - `a || (a && b) = a`
    - `a && (a || b) = a`
  - Idempotent:
    - `a || a = a`
    - `a && a = a`
  - Identity:
    - `a || ff = a`
    - `a && tt = a`
  - Implication:
    - ``a `implies` a = tt``
    - ``a && (a `implies` b) = a && b``
    - ``b && (a `implies` b) = b``
    - ``a `implies` (b && c) = (a `implies` b) && (a `implies` c)``
  - Complemented:
    - ``not a = a `implies` ff``

*/
export interface HeytingAlgebra<A> {
  ff(): A,
  tt(): A,
  implies(x: A, y: A): A,
  conj(x: A, y: A): A,
  disj(x: A, y: A): A,
  not(x: A): A
}

export const booleanHeytingAlgebra: HeytingAlgebra<boolean> = {
  ff: () => false,
  tt: () => true,
  implies: (x: boolean, y: boolean) => !x || y,
  conj: (x: boolean, y: boolean) => x && y,
  disj: (x: boolean, y: boolean) => x || y,
  not: (x: boolean) => !x
}
