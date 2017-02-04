// @flow

declare var describe: Function;
declare var it: Function;

import assert from 'assert'
import type { Getter } from '../src/Getter'
import {
  asFold,
  composeGetter
} from '../src/Getter'
import { stringMonoid } from '../src/Monoid'

type User = { name: string, surname: string };
const user = { name: 'Giulio', surname: 'Canti' }
const f: Getter<User, string> = {
  get(s: User): string {
    return s.name
  }
}
const g: Getter<string, string> = {
  get(s: string): string {
    return s.substring(0, 2)
  }
}

describe('Getter', () => {

  it('asFold', () => {
    assert.strictEqual(asFold(f).foldMap(stringMonoid, s => s + '-', user), 'Giulio-')
  })

  it('composeGetter', () => {
    assert.strictEqual(composeGetter(g, f).get(user), 'Gi')
  })

})
