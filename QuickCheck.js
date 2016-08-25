// @flow
import type { Eff } from './Eff'
import * as eff from './Eff'
import { CONSOLE } from './Console'
import { RANDOM, random } from './Random'
import { EXCEPTION, throwException, error } from './Exception'
import type { State } from './State'
import * as state from './State'
import type { Arr } from './Arr'
import * as arr from './Arr'
import { log } from './Console'
import type { Either } from './Either'
import * as either from './Either'
import { replicateA } from './Unfoldable'
import * as tuple from './Tuple'

/*

  Example:

  import { quickCheck2, choose, getTestableFunction } from 'flow-static-land/QuickCheck'
  import { runEff } from 'flow-static-land/Eff'

  const testable = getTestableFunction(choose(0, 10))
  const prop = (n) => n < 5
  runEff(quickCheck2(testable, 10, prop))

*/

// A type synonym which represents the effects used by the `quickCheck` function.
type QC<E, A> = Eff<{ console: CONSOLE, random: RANDOM, err: EXCEPTION } & E, A>;

type Result = Either<string, void>;

type Seed = number;

type Size = number;

type GenState = {
  newSeed: Seed,
  size: Size
};

type Gen<A> = State<GenState, A>;

export interface Testable<P> {
  test(props: P): Gen<Result>
}

export function quickCheck<E, P>(testable: Testable<P>, prop: P): QC<E, void> {
  return quickCheck2(testable, 100, prop)
}

export function quickCheckPure<P>(testable: Testable<P>, s: Seed, n: number, prop: P): Arr<Result> {
  return state.evalState(replicateA(state, arr, n, testable.test(prop)), { newSeed: s, size: 10 })
}

function throwOnFirstFailure<E>(results: Arr<Result>): QC<E, void> {
  const as = arr.prj(results)
  const len = as.length
  if (len > 0) {
    for (let i = 0; i < len; i++) {
      const result = either.prj(as[i])
      if (result instanceof either.Left) {
        return throwException(error(`Test ${i + 1} failed: \n${result.value0}`))
      }
    }
  }
  return eff.inj(() => undefined)
}

const getMessage = (p, n) => `${p}/${n} test(s) passed.`

export function quickCheck2<E, P>(testable: Testable<P>, n: number, prop: P): QC<E, void> {
  return eff.chain(seed => {
    const results = quickCheckPure(testable, seed, n, prop)
    const message = log(getMessage(arr.length(results), n))
    return eff.chain(() => throwOnFirstFailure(results), message)
  }, random())
}

const testBoolean = {
  test(b: boolean): Gen<Result> {
    return state.of(b ? either.right() : either.left('Test returned false'))
  }
}

const perturbSeed = seed => seed + Math.random() - Math.random() // <= cheating

const uniform: Gen<number> = state.inj(s => {
  const newSeed = perturbSeed(s.newSeed)
  return tuple.inj([
    newSeed,
    { newSeed: newSeed, size: s.size }
  ])
})

export function choose(a: number, b: number): Gen<number> {
  const min = Math.min(a, b)
  const max = Math.max(a, b)
  return state.map(n => {
    return (n * (max - min)) + min
  }, uniform)
}

export function getTestableFunction<T>(gen: Gen<T>): Testable<(t: T) => boolean> {
  return {
    test(f) {
      return state.chain(a => testBoolean.test(f(a)), gen)
    }
  }
}
