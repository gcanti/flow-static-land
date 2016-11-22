// @flow
export type Predicate<A> = (a: A) => boolean;

export type Fn1<A, B> = (a: A, ...rest: Array<void>) => B;
export type Fn2<A, B, C> = (a: A, b: B, ...rest: Array<void>) => C;
export type Fn3<A, B, C, D> = (a: A, b: B, c: C, ...rest: Array<void>) => D;
export type Fn4<A, B, C, D, E> = (a: A, b: B, c: C, d: D, ...rest: Array<void>) => E;
export type Fn5<A, B, C, D, E, F> = (a: A, b: B, c: C, d: D, e: E, ...rest: Array<void>) => F;
export type Fn6<A, B, C, D, E, F, G> = (a: A, b: B, c: C, d: D, e: E, f: F, ...rest: Array<void>) => G;
export type Fn7<A, B, C, D, E, F, G, H> = (a: A, b: B, c: C, d: D, e: E, f: F, g: G, ...rest: Array<void>) => H;
export type Fn8<A, B, C, D, E, F, G, H, I> = (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, ...rest: Array<void>) => I;
export type Fn9<A, B, C, D, E, F, G, H, I, L> = (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, ...rest: Array<void>) => L;

export type Endomorphism<A> = Fn1<A, A>;

declare function compose<A, B, C>(bc: Fn1<B, C>, ab: Fn1<A, B>, ...rest: Array<void>): Fn1<A, C>; // eslint-disable-line no-redeclare
declare function compose<A, B, C, D>(cd: Fn1<C, D>, bc: Fn1<B, C>, ab: Fn1<A, B>, ...rest: Array<void>): Fn1<A, D>; // eslint-disable-line no-redeclare
declare function compose<A, B, C, D, E>(de: Fn1<D, E>, cd: Fn1<C, D>, bc: Fn1<B, C>, ab: Fn1<A, B>, ...rest: Array<void>): Fn1<A, E>; // eslint-disable-line no-redeclare
declare function compose<A, B, C, D, E, F>(fe: Fn1<F, E>, de: Fn1<D, E>, cd: Fn1<C, D>, bc: Fn1<B, C>, ab: Fn1<A, B>, ...rest: Array<void>): Fn1<A, F>; // eslint-disable-line no-redeclare
declare function compose<A, B, C, D, E, F, G>(fg: Fn1<F, G>, fe: Fn1<F, E>, de: Fn1<D, E>, cd: Fn1<C, D>, bc: Fn1<B, C>, ab: Fn1<A, B>, ...rest: Array<void>): Fn1<A, G>; // eslint-disable-line no-redeclare
declare function compose<A, B, C, D, E, F, G, H>(fh: Fn1<F, H>, fg: Fn1<F, G>, fe: Fn1<F, E>, de: Fn1<D, E>, cd: Fn1<C, D>, bc: Fn1<B, C>, ab: Fn1<A, B>, ...rest: Array<void>): Fn1<A, H>; // eslint-disable-line no-redeclare
declare function compose<A, B, C, D, E, F, G, H, I>(fi: Fn1<H, I>, fh: Fn1<F, H>, fg: Fn1<F, G>, fe: Fn1<F, E>, de: Fn1<D, E>, cd: Fn1<C, D>, bc: Fn1<B, C>, ab: Fn1<A, B>, ...rest: Array<void>): Fn1<A, I>; // eslint-disable-line no-redeclare
declare function compose<A, B, C, D, E, F, G, H, I, J>(fj: Fn1<I, J>, fi: Fn1<H, I>, fh: Fn1<F, H>, fg: Fn1<F, G>, fe: Fn1<F, E>, de: Fn1<D, E>, cd: Fn1<C, D>, bc: Fn1<B, C>, ab: Fn1<A, B>, ...rest: Array<void>): Fn1<A, J>; // eslint-disable-line no-redeclare

declare function pipe<A, B, C>(ab: Fn1<A, B>, bc: Fn1<B, C>, ...rest: Array<void>): Fn1<A, C>; // eslint-disable-line no-redeclare
declare function pipe<A, B, C, D>(ab: Fn1<A, B>, bc: Fn1<B, C>, cd: Fn1<C, D>, ...rest: Array<void>): Fn1<A, D>; // eslint-disable-line no-redeclare
declare function pipe<A, B, C, D, E>(ab: Fn1<A, B>, bc: Fn1<B, C>, cd: Fn1<C, D>, de: Fn1<D, E>, ...rest: Array<void>): Fn1<A, E>; // eslint-disable-line no-redeclare
declare function pipe<A, B, C, D, E, F>(ab: Fn1<A, B>, bc: Fn1<B, C>, cd: Fn1<C, D>, de: Fn1<D, E>, ef: Fn1<E, F>, ...rest: Array<void>): Fn1<A, F>; // eslint-disable-line no-redeclare
declare function pipe<A, B, C, D, E, F, G>(ab: Fn1<A, B>, bc: Fn1<B, C>, cd: Fn1<C, D>, de: Fn1<D, E>, ef: Fn1<E, F>, fg: Fn1<F, G>, ...rest: Array<void>): Fn1<A, G>; // eslint-disable-line no-redeclare
declare function pipe<A, B, C, D, E, F, G, H>(ab: Fn1<A, B>, bc: Fn1<B, C>, cd: Fn1<C, D>, de: Fn1<D, E>, ef: Fn1<E, F>, fg: Fn1<F, G>, gh: Fn1<G, H>, ...rest: Array<void>): Fn1<A, H>; // eslint-disable-line no-redeclare
declare function pipe<A, B, C, D, E, F, G, H, I>(ab: Fn1<A, B>, bc: Fn1<B, C>, cd: Fn1<C, D>, de: Fn1<D, E>, ef: Fn1<E, F>, fg: Fn1<F, G>, gh: Fn1<G, H>, hi: Fn1<H, I>, ...rest: Array<void>): Fn1<A, I>; // eslint-disable-line no-redeclare
declare function pipe<A, B, C, D, E, F, G, H, I, J>(ab: Fn1<A, B>, bc: Fn1<B, C>, cd: Fn1<C, D>, de: Fn1<D, E>, ef: Fn1<E, F>, fg: Fn1<F, G>, gh: Fn1<G, H>, hi: Fn1<H, I>, ij: Fn1<I, J>, ...rest: Array<void>): Fn1<A, J>; // eslint-disable-line no-redeclare

export type CurriedFn2<A, B, C> =
  & Fn1<A, Fn1<B, C>>
  & Fn2<A, B, C>;
export type CurriedFn3<A, B, C, D> =
  & Fn1<A, CurriedFn2<B, C, D>>
  & Fn2<A, B, Fn1<C, D>>
  & Fn3<A, B, C, D>;
export type CurriedFn4<A, B, C, D, E> =
  & Fn1<A, CurriedFn3<B, C, D, E>>
  & Fn2<A, B, CurriedFn2<C, D, E>>
  & Fn3<A, B, C, Fn1<D, E>>
  & Fn4<A, B, C, D, E>;
export type CurriedFn5<A, B, C, D, E, F> =
  & Fn1<A, CurriedFn4<B, C, D, E, F>>
  & Fn2<A, B, CurriedFn3<C, D, E, F>>
  & Fn3<A, B, C, CurriedFn2<D, E, F>>
  & Fn4<A, B, C, D, Fn1<E, F>>
  & Fn5<A, B, C, D, E, F>;

declare function curry<A, B, C>(f: Fn2<A, B, C>): CurriedFn2<A, B, C>; // eslint-disable-line no-redeclare
declare function curry<A, B, C, D>(f: Fn3<A, B, C, D>): CurriedFn3<A, B, C, D>; // eslint-disable-line no-redeclare
declare function curry<A, B, C, D, E>(f: Fn4<A, B, C, D, E>): CurriedFn4<A, B, C, D, E>; // eslint-disable-line no-redeclare
declare function curry<A, B, C, D, E, F>(f: Fn5<A, B, C, D, E, F>): CurriedFn5<A, B, C, D, E, F>; // eslint-disable-line no-redeclare

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

export function compose(...fns) { // eslint-disable-line no-redeclare
  const len = fns.length - 1
  return x => {
    let y = x
    for (let i = len; i > -1; i--) {
      y = fns[i].call(this, y)
    }
    return y
  }
}

export function pipe(...fns) { // eslint-disable-line no-redeclare
  const len = fns.length - 1
  return x => {
    let y = x
    for (let i = 0; i <= len; i++) {
      y = fns[i].call(this, y)
    }
    return y
  }
}

function curried(f, length, acc) {
  return function () {
    const combined = acc.concat(Array.prototype.slice.call(arguments))
    return combined.length >= length ? f.apply(this, combined) : curried(f, length, combined)
  }
}

export function curry(f: Function) { // eslint-disable-line no-redeclare
  return curried(f, f.length, [])
}
