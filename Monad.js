// @flow
import type { Applicative } from './Applicative'
import type { Chain } from './Chain'

export interface Monad<F, A, B> extends Applicative<F, A, B>, Chain<F, A, B> {}
