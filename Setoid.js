// @flow
export interface Setoid<A> {
  equals(x: A, y: A): boolean
}

export function strictEquals(a: any, b: any): boolean {
  return a === b
}

export const setoidBoolean: Setoid<boolean> = {
  equals: strictEquals
}

export const setoidNumber: Setoid<number> = {
  equals: strictEquals
}

export const setoidString: Setoid<string> = {
  equals: strictEquals
}
