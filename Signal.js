// @flow
import type { Applicative } from './Applicative'
import type { Functor } from './Functor'
import type { Semigroup } from './Semigroup'
import type { Foldable } from './Foldable'
import type { Maybe } from './Maybe'
import type { Setoid } from './Setoid'
import type { Predicate } from './Fun'

import { HKT } from './HKT'
import * as maybe from './Maybe'

class IsSignal {}

export type SignalV<A> = {
  subscribe(subscriber: (a: A) => any): void,
  get(): A,
  set(a: A): void
};
export type Signal<A> = HKT<IsSignal, A>;

export function inj<A>(a: SignalV<A>): Signal<A> {
  return ((a: any): Signal<A>)
}

export function prj<A>(fa: Signal<A>): SignalV<A> {
  return ((fa: any): SignalV<A>)
}

export function of<A>(a: A): Signal<A> {
  const subscribers = []
  let val = a
  return inj({
    subscribe(subscriber) {
      subscribers.push(subscriber)
      subscriber(val)
    },
    get(): A { return val },
    set(a: A) {
      val = a
      subscribers.forEach(subscriber => subscriber(a))
    }
  })
}

export function map<A, B>(f: (a: A) => B, fa: Signal<A>): Signal<B> {
  const sa = prj(fa)
  const out = of(f(sa.get()))
  const sout = prj(out)
  sa.subscribe(a => sout.set(f(a)))
  return out
}

export function ap<A, B>(fab: Signal<(a: A) => B>, fa: Signal<A>): Signal<B> {
  const sa = prj(fa)
  const sab = prj(fab)
  const out = of(sab.get()(sa.get()))
  const sout = prj(out)
  const subscriber = () => sout.set(sab.get()(sa.get()))
  sa.subscribe(subscriber)
  sab.subscribe(subscriber)
  return out
}

// Creates a past dependent signal. The function argument takes the value of
// the input signal, and the previous value of the output signal, to produce
// the new value of the output signal.
export function foldp<A, B>(f: (a: A, b: B) => A, a: A, fb: Signal<B>): Signal<A> {
  const out = of(a)
  const sout = prj(out)
  const sb = prj(fb)
  let acc: A = a
  sb.subscribe(b => {
    acc = f(acc, b)
    sout.set(acc)
  })
  return out
}

// Merge two signals, returning a new signal which will yield a value
// whenever either of the input signals yield. Its initial value will be
// that of the first signal.
export function concat<A>(x: Signal<A>, y: Signal<A>): Signal<A> {
  const sx = prj(x)
  const sy = prj(y)
  const out = of(sx.get())
  const sout = prj(out)
  sy.subscribe(sout.set)
  sx.subscribe(sout.set)
  return out
}

function mergeMaybes<A>(x: Maybe<Signal<A>>, y: Maybe<Signal<A>>): Maybe<Signal<A>> {
  return maybe.concat({ concat }, x, y)
}

// Merge all signals inside a `Foldable`, returning a `Maybe` which will
// either contain the resulting signal, or `Nothing` if the `Foldable`
// was empty
export function mergeMany<F, A>(foldable: Functor<F> & Foldable<F>, fa: HKT<F, Signal<A>>): Maybe<Signal<A>> {
  return foldable.reduce(mergeMaybes, maybe.Nothing, foldable.map(maybe.of, fa))
}

// Creates a signal which yields the current value of the second signal every
// time the first signal yields.
export function sampleOn<A, B>(fa: Signal<A>, fb: Signal<B>): Signal<B> {
  const sa = prj(fa)
  const sb = prj(fb)
  const out = of(sb.get())
  const sout = prj(out)
  sa.subscribe(() => sout.set(sb.get()))
  return out
}

// Create a signal which only yields values which aren't equal to the previous
// value of the input signal.
export function dropRepeats<A>(setoid: Setoid<A>, fa: Signal<A>): Signal<A> {
  const sa = prj(fa)
  const out = of(sa.get())
  const sout = prj(out)
  sa.subscribe(a => {
    if (!setoid.equals(a, sout.get())) {
      sout.set(a)
    }
  })
  return out
}

// Takes a signal and filters out yielded values for which the provided
// predicate function returns `false`.
export function filter<A>(predicate: Predicate<A>, a: A, fa: Signal<A>): Signal<A> {
  const sa = prj(fa)
  const val = sa.get()
  const out = of(predicate(val) ? val : a)
  const sout = prj(out)
  sa.subscribe(a => {
    if (predicate(a)) {
      sout.set(a)
    }
  })
  return out
}

if (false) { // eslint-disable-line
  ({
    map,
    ap,
    of,
    concat
  }: Applicative<IsSignal> &
     Semigroup<HKT<IsSignal, *>>)
}
