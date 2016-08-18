// @flow
import { HKT } from './HKT'
import type { Alt } from './Alt'

export interface Plus<F> extends Alt<F> {
  pempty(): HKT<F, any>
}
