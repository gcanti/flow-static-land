// @flow
import { HKT } from './HKT'
import type { HKT2 } from './HKT'
import type { Monad } from './Monad'
import type { Tuple } from './Tuple'
import * as tuple from './Tuple'

class IsState {}

export type StateV<S, A> = (s: S) => Tuple<A, S>;

export type State<S, A> = HKT2<IsState, S, A>;

export function inj<S, A>(a: StateV<S, A>): State<S, A> {
  return ((a: any): State<S, A>)
}

export function prj<S, A>(fa: State<S, A>): StateV<S, A> {
  return ((fa: any): StateV<S, A>)
}

export function get<S>(): State<S, S> {
  return inj(s => tuple.inj([s, s]))
}

export function put<S>(s: S): State<S, void> {
  return inj(() => tuple.inj([undefined, s]))
}

export function modify<S>(f: (s: S) => S): State<S, void> {
  return inj(s => tuple.inj([undefined, f(s)]))
}

export function gets<S, A>(f: (s: S) => A): State<S, A> {
  return chain(s => of(f(s)), get())
}

export function runState<S, A>(sa: State<S, A>, s: S): Tuple<A, S> {
  return prj(sa)(s)
}

export function evalState<S, A>(sa: State<S, A>, s: S): A {
  return tuple.fst(runState(sa, s))
}

export function execState<S, A>(sa: State<S, A>, s: S): S {
  return tuple.snd(runState(sa, s))
}

export function map<S, A, B>(f: (a: A) => B, fa: State<S, A>): State<S, B> {
  return inj(s => {
    const t = runState(fa, s)
    return tuple.inj([f(tuple.fst(t)), tuple.snd(t)])
  })
}

export function ap<S, A, B>(fab: State<S, (a: A) => B>, fa: State<S, A>): State<S, B> {
  return chain(f => map(f, fa), fab) // <= derived
}

export function of<S, A>(a: A): State<S, A> {
  return inj(s => tuple.inj([a, s]))
}

export function chain<S, A, B>(f: (a: A) => State<S, B>, fa: State<S, A>): State<S, B> {
  return inj(s => {
    const t = runState(fa, s)
    return runState(f(tuple.fst(t)), tuple.snd(t))
  })
}

if (false) { // eslint-disable-line
  ({
    map,
    ap,
    of,
    chain
  }: Monad<HKT<IsState, *>>)
}
