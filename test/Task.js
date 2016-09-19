/* globals Promise */
// @flow

declare var describe: Function;
declare var it: Function;

import assert from 'assert'
import type { PureTask } from '../src/Task'
import type { Either } from '../src/Either'
import * as either from '../src/Either'
import {
  inj,
  of,
  ap,
  unsafePerformTask,
  after,
  tryTask
} from '../src/Task'

const double = (n: number): number => n * 2

describe('Task', () => {

  it('of', () => {
    const fut: PureTask<number> = of(1)
    return unsafePerformTask(fut).then(x => assert.strictEqual(x, 1))
  })

  it('ap', () => {
    const fut: PureTask<number> = after(50, 1)
    const f: PureTask<typeof double> = after(100, double)
    return unsafePerformTask(ap(f, fut)).then(x => assert.strictEqual(x, 2))
  })

  it('tryTask', () => {
    const fut: PureTask<number> = inj(() => Promise.reject(new Error('boom!')).then(double))
    return unsafePerformTask(tryTask(fut)).then((x: Either<Error, number>) => {
      assert.ok(either.isLeft(x))
      if (x instanceof either.Left) {
        assert.strictEqual(x.value0.message, 'boom!')
      }
    })
  })

})
