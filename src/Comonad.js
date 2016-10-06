// @flow
import type { Extend } from './Extend'
import type { Copointed } from './Copointed'

export interface Comonad<F> extends Extend<F>, Copointed<F> {}
