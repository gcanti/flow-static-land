// @flow
import type { HKT2 } from './HKT'
import type { Monad } from './Monad'
import type { Eff } from './Eff'
import type { Either } from './Either'
import type { Monoid } from './Monoid'

import { HKT } from './HKT'
import * as eff from './Eff'
import * as either from './Either'

class IsTask {}

export type TaskV<A> = () => Promise<A>;

// A Task is a computation which yields an effect E and a value A
export type Task<E, A> = HKT2<IsTask, E, A>;

export type PureTask<A> = Task<{}, A>;

export type TaskF = HKT<IsTask, *>;

export function inj<E, A>(a: TaskV<A>): Task<E, A> {
  return ((a: any): Task<E, A>)
}

export function prj<E, A>(fa: Task<E, A>): TaskV<A> {
  return ((fa: any): TaskV<A>)
}

export function runTask<E, A>(fut: Task<E, A>): Eff<E, Promise<A>> {
  return eff.inj(prj(fut))
}

export function unsafePerformTask<E, A>(fut: Task<E, A>): Promise<A> {
  return prj(fut)()
}

export function map<E, A, B>(f: (a: A) => B, fa: Task<E, A>): Task<E, B> {
  return inj(() => unsafePerformTask(fa).then(f))
}

// the derived implementation
//   return chain(f => map(f, fa), fab)
// will not execute the futures in parallel
export function ap<E1, E2, E: E1 & E2, A, B>(fab: Task<E1, (a: A) => B>, fa: Task<E2, A>): Task<E, B> {
  return inj(() => {
    return Promise.all([
      unsafePerformTask(fab),
      unsafePerformTask(fa)
    ]).then(([f, a]) => f(a))
  })
}

export function of<E, A>(a: A): Task<E, A> {
  return inj(() => Promise.resolve(a))
}

export function chain<E1, E2, E: E1 & E2, A, B>(f: (a: A) => Task<E1, B>, fa: Task<E2, A>): Task<E, B> {
  return inj(() => unsafePerformTask(fa).then(a => unsafePerformTask(f(a))))
}

const noop: () => void = () => {}

// Returns a Task that will never resolve
export function empty<E, A>(): Task<E, A> {
  return inj(() => new Promise(noop))
}

// Selects the earlier of the two futures
export function concat<E, A>(x: Task<E, A>, y: Task<E, A>): Task<E, A> {
  return inj(() => new Promise((resolve, reject) => {
    let done = false
    const guard = f => a => {
      if (!done) {
        done = true
        f(a)
      }
    }
    unsafePerformTask(x).then(guard(resolve), guard(reject))
    unsafePerformTask(y).then(guard(resolve), guard(reject))
  }))
}

// Returns a Task which yields `a` after `delay` milliseconds
export function after<E, A>(delay: number, a: A): Task<E, A> {
  return inj(() => new Promise(resolve => {
    setTimeout(() => {
      resolve(a)
    }, delay)
  }))
}

// Catches a possible error returning it as an Either
export function tryTask<E, A>(fa: Task<E, A>): Task<E, Either<Error, A>> {
  return inj(() => unsafePerformTask(fa).then(
    either.right,
    either.left
  ))
}

if (false) { // eslint-disable-line
  ({
    map,
    ap,
    of,
    chain,
    empty,
    concat
  }: Monad<TaskF> &
     Monoid<Task<*, *>>)
}
