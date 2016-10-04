// @flow
import type { HKT2 } from './HKT'
import type { Semigroupoid } from './Semigroupoid'
import type { Monoid } from './Monoid'

export interface Category<C> extends Semigroupoid<C> {
  id<A>(): HKT2<C, A, A>
}

// the set of arrows from A to B
export type Hom<C, A, B> = HKT2<C, A, B>;

// the set of arrows from A to A
export type Endo<C, A> = HKT2<C, A, A>;

// for any object A in any category C, the set of arrows from A to A
// is a monoid under the composition operation of C
export function getMonoid<C, A>(category: Category<C>): Monoid<Endo<C, A>> {
  return {
    empty(): Endo<C, A> {
      return category.id()
    },
    concat(x: Endo<C, A>, y: Endo<C, A>): Endo<C, A> {
      return category.compose(x, y)
    }
  }
}
