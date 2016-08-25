// @flow
import { HKT } from './HKT'
import { unsafeCoerce } from './Unsafe'
import { of, extract, id } from './Identity'

export type Leibnitz<A, B> = {
  <F>(a: HKT<F, A>): HKT<F, B>
};

export function simm<A, B>(proof: Leibnitz<A, B>): Leibnitz<B, A> {
  return unsafeCoerce(proof)
}

export function coerce<A, B>(proof: Leibnitz<A, B>): (a: A) => B {
  return a => extract(proof(of(a)))
}

export function coerceSymm<A, B>(proof: Leibnitz<A, B>): (b: B) => A {
  return coerce(simm(proof))
}

export function refl<A>(): Leibnitz<A, A> {
  return unsafeCoerce(id)
}

export function subst<F, A, B>(proof: Leibnitz<A, B>, fa: HKT<F, A>): HKT<F, B> {
  return proof(fa)
}
