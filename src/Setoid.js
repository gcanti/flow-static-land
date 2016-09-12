// @flow
export interface Setoid<A> {
  equals(x: A, y: A): boolean
}

export function strictEquals(a: any, b: any): boolean {
  return a === b
}

export const booleanSetoid: Setoid<boolean> = {
  equals: strictEquals
}

export const numberSetoid: Setoid<number> = {
  equals: strictEquals
}

export const stringSetoid: Setoid<string> = {
  equals: strictEquals
}
