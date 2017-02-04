// @flow

declare var describe: Function;
declare var it: Function;

import assert from 'assert'
import {
  foldMap
} from '../src/Foldable'
import * as arr from '../src/Arr'
import { stringMonoid, getDualMonoid } from '../src/Monoid'
import { Data1, Data3 } from '../src/Data'

class Empty {}
class Leaf<A> extends Data1<A> {}
class Node<A> extends Data3<Tree<A>, A, Tree<A>> {}

type Tree<A> = Empty | Leaf<A> | Node<A>;

describe('Foldable', () => {

  it('foldMap', () => {
    const as = arr.inj(['a', 'b', 'c'])
    assert.strictEqual(arr.reduce((acc, a) => acc + a, '', as), 'abc')
    assert.strictEqual(foldMap(arr, stringMonoid, a => a, as), 'cba')
    assert.strictEqual(foldMap(arr, getDualMonoid(stringMonoid), a => a, as), 'abc')
  })

})
