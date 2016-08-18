// @flow
import type { Alt } from './Alt'

export interface Plus<F, A> extends Alt<F> {
  pempty(): A
}
