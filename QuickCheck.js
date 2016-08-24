// @flow
import type { Eff } from './Eff'
import * as eff from './Eff'
import { CONSOLE } from './Console'
import { RANDOM, randomInt } from './Random'
import { EXCEPTION, throwException, error } from './Exception'
import type { State } from './State'
import * as state from './State'
import type { Arr } from './Arr'
import * as arr from './Arr'
import { log } from './Console'
import type { Either } from './Either'
import * as either from './Either'
import { replicateA } from './Unfoldable'

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

export function quickCheck<E, P>(dictTestable: Testable<P>, prop: P): QC<E, void> {
  return quickCheck2(dictTestable, 100, prop)
}

export function quickCheckPure<P>(dictTestable: Testable<P>, s: Seed, n: number, prop: P): Arr<Result> {
  return state.evalState(replicateA(state, arr, n, dictTestable.test(prop)), { newSeed: s, size: 10 })
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

const lcgM = 48271

const seedMin = 1

const seedMax = lcgM - 1

const randomSeed = () => randomInt(seedMin, seedMax)

export function quickCheck2<E, P>(dictTestable: Testable<P>, n: number, prop: P): QC<E, void> {
  return eff.chain((seed) => {
    const results = quickCheckPure(dictTestable, seed, n, prop)
    return eff.chain(() => throwOnFirstFailure(results), log(getMessage(arr.length(results), n)))
  }, randomSeed())
}

