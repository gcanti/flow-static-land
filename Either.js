// @flow
import { HKT } from './HKT'
import type { HKT2 } from './HKT'
import { unsafeCoerce } from './Unsafe'
import type { Bifunctor } from './Bifunctor'
import type { Monad } from './Monad'
import type { Alt } from './Alt'
import type { Extend } from './Extend'
import type { Foldable } from './Foldable'
import type { Applicative } from './Applicative'
import type { Traversable } from './Traversable'
import type { Semigroup } from './Semigroup'

class IsEither {}

export class Left<L> {
  value0: L;
  constructor(value0: L) {
    this.value0 = value0
  }
}

export class Right<R> {
  value0: R;
  constructor(value0: R) {
    this.value0 = value0
  }
}

export type EitherV<L, R> = Left<L> | Right<R>;
export type Either<L, R> = HKT2<IsEither, L, R>;

function inj<L, R>(e: EitherV<L, R>): Either<L, R> {
  return ((e: any): Either<L, R>)
}

function prj<L, R>(fe: Either<L, R>): EitherV<L, R> {
  return ((fe: any): EitherV<L, R>)
}

export function left<L, R>(left: L): Either<L, R> {
  return inj(new Left(left))
}

export function right<L, R>(right: R): Either<L, R> {
  return inj(new Right(right))
}

export function isLeft<L, R>(e: Either<L, R>): boolean {
  return prj(e) instanceof Left
}

export function isRight<L, R>(e: Either<L, R>): boolean {
  return prj(e) instanceof Right
}

export function map<L, A, B>(f: (a: A) => B, fa: Either<L, A>): Either<L, B> {
  const a = prj(fa)
  if (a instanceof Left) {
    return unsafeCoerce(a)
  }
  return right(f(a.value0))
}

export function bimap<A, B, C, D>(f: (a: A) => B, g: (c: C) => D, fac: Either<A, C>): Either<B, D> {
  const ac = prj(fac)
  if (ac instanceof Left) {
    return left(f(ac.value0))
  }
  return right(g(ac.value0))
}

export function ap<L, A, B>(fab: Either<L, (a: A) => B>, fa: Either<L, A>): Either<L, B> {
  const ab = prj(fab)
  if (ab instanceof Left) {
    return unsafeCoerce(ab)
  }
  return map(ab.value0, fa)
}

export const of = right

export function chain<L, A, B>(f: (a: A) => Either<L, B>, fa: Either<L, A>): Either<L, B> {
  const a = prj(fa)
  if (a instanceof Left) {
    return unsafeCoerce(fa)
  }
  return f(a.value0)
}

export function alt<L, A>(fx: Either<L, A>, fy: Either<L, A>): Either<L, A> {
  return prj(fx) instanceof Left ? fy : fx
}

export function extend<L, A, B>(f: (ea: Either<L, A>) => B, ea: Either<L, A>): Either<L, B> {
  return prj(ea) instanceof Left ? unsafeCoerce(ea) : right(f(ea))
}

export function reduce<L, A, B>(f: (a: A, b: B) => A, a: A, fb: Either<L, B>): A {
  const b = prj(fb)
  if (b instanceof Left) {
    return a
  }
  return f(a, b.value0)
}

export function sequence<L, F, A>(dictApplicative: Applicative<F>, tfa: Either<L, HKT<F, A>>): HKT<F, Either<L, A>> {
  const fa = prj(tfa)
  if (fa instanceof Left) {
    return dictApplicative.of(unsafeCoerce(tfa))
  }
  return dictApplicative.map(of, fa.value0)
}

export function getSemigroup<L, R>(dictSemigroup: Semigroup<R>): Semigroup<Either<L, R>> {
  return {
    concat(a, b) {
      const av = prj(a)
      const bv = prj(b)
      if (av instanceof Right && bv instanceof Right) {
        return right(dictSemigroup.concat(av.value0, bv.value0))
      }
      return a
    }
  }
}

if (false) { // eslint-disable-line
  ({
    map,
    ap,
    of,
    chain,
    bimap,
    alt,
    extend,
    reduce,
    sequence
  }: Monad<HKT<IsEither, *>> &
     Bifunctor<IsEither> &
     Alt<HKT<IsEither, *>> &
     Extend<HKT<IsEither, *>> &
     Foldable<HKT<IsEither, *>> &
     Traversable<HKT<IsEither, *>>)
}
