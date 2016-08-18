// @flow
import type { Applicative } from './Applicative'
import type { Plus } from './Plus'

export interface Alternative<F, A> extends Applicative<F>, Plus<F, A> {}
