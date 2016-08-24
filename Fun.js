// @flow
export type Predicate<A> = (a: A) => boolean;

// Flips the order of the arguments to a function of two arguments.
export function flip<A, B, C>(f: (a: A, b: B) => C): (b: B, a: A) => C {
  return (b, a) => f(a, b)
}

// Returns its first argument and ignores its second.
export function constant<A, B>(a: A): (b: B) => A {
  return () => a
}

// The `on` function is used to change the domain of a binary operator.
export function on<A, B, C>(o: (x: B, y: B) => C, f: (a: A) => B): (x: A, y: A) => C {
  return (x, y) => o(f(x), f(y))
}

export function compose<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C {
  return (a) => f(g(a))
}

export function pipe<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C {
  return (a) => g(f(a))
}
