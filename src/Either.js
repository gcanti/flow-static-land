// @flow
import type { HKT2 } from './HKT'
import type { Bifunctor } from './Bifunctor'
import type { Monad } from './Monad'
import type { Alt } from './Alt'
import type { Extend } from './Extend'
import type { Foldable } from './Foldable'
import type { Applicative } from './Applicative'
import type { Traversable } from './Traversable'
import type { Semigroup } from './Semigroup'
import type { MonadError } from './MonadError'

import { HKT } from './HKT'
import { unsafeCoerce } from './Unsafe'
import { Data1 } from './Data'
import { id } from './Identity'

class IsEither {}

export class Left<L> extends Data1<L> {}

export class Right<R> extends Data1<R> {}

export type EitherV<L, R> = Left<L> | Right<R>;

export type Either<L, R> = HKT2<IsEither, L, R>;

export type EitherF = HKT<IsEither, *>;

export function inj<L, R>(e: EitherV<L, R>): Either<L, R> {
  return ((e: any): Either<L, R>)
}

export function prj<L, R>(fe: Either<L, R>): EitherV<L, R> {
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

export function fromLeft<L, R>(flr: Either<L, R>): L {
  const lr = prj(flr)
  if (lr instanceof Right) {
    throw new Error('fromLeft returned a Right')
  }
  return lr.value0
}

export function fromRight<L, R>(flr: Either<L, R>): R {
  const lr = prj(flr)
  if (lr instanceof Left) {
    throw new Error('fromRight returned a Left')
  }
  return lr.value0
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

export function leftMap<L1, L2, R>(f: (l: L1) => L2, e: Either<L1, R>): Either<L2, R> {
  return either.bimap(f, id, e)
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
  if (prj(fx) instanceof Left) {
    return fy
  }
  return fx
}

export function extend<L, A, B>(f: (ea: Either<L, A>) => B, ea: Either<L, A>): Either<L, B> {
  return prj(ea) instanceof Left ? unsafeCoerce(ea) : right(f(ea))
}

export function reduce<L, A, B>(f: (b: B, a: A) => B, b: B, fa: Either<L, A>): B {
  const a = prj(fa)
  if (a instanceof Left) {
    return b
  }
  return f(b, a.value0)
}

export function traverse<F, L, A, B>(applicative: Applicative<F>, f: (a: A) => HKT<F, B>, ta: Either<L, A>): HKT<F, Either<L, B>> {
  const a = prj(ta)
  if (a instanceof Left) {
    return applicative.of(unsafeCoerce(ta))
  }
  return applicative.map(of, f(a.value0))
}

export function getMonadError<E>(): MonadError<E, HKT<IsEither, E>> {
  return {
    of,
    map,
    ap,
    chain,
    throwError<A>(e: E): Either<E, A> {
      return left(e)
    },
    catchError<A>(ma: Either<E, A>, handler: (e: E) => Either<E, A>): Either<E, A> {
      return either(handler, right, ma)
    }
  }
}

export function concat<L, R>(semigroup: Semigroup<R>): (fx: Either<L, R>, fy: Either<L, R>) => Either<L, R> {
  return function concat(fx, fy) {
    const x = prj(fx)
    const y = prj(fy)
    if (x instanceof Right && y instanceof Right) {
      return right(semigroup.concat(x.value0, y.value0))
    }
    return fx
  }
}

export function getSemigroup<L, R>(semigroup: Semigroup<R>): Semigroup<Either<L, R>> {
  return {
    concat: concat(semigroup)
  }
}

export function either<L, R, C>(f: (l: L) => C, g: (r: R) => C, fa: Either<L, R>): C {
  const a = prj(fa)
  if (a instanceof Left) {
    return f(a.value0)
  }
  return g(a.value0)
}

export class Do<L, A> {
  static of(a: A): Do<L, A> {
    return new Do(of(a))
  }
  value: Either<L, A>;
  constructor(value: Either<L, A>) {
    this.value = value
  }
  map<B>(f: (a: A) => B): Do<L, B> {
    return new Do(map(f, this.value))
  }
  chain<B>(f: (a: A) => Either<L, B>): Do<L, B> {
    return new Do(chain(f, this.value))
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
    traverse
  }: Monad<EitherF> &
     Bifunctor<IsEither> &
     Alt<EitherF> &
     Extend<EitherF> &
     Foldable<EitherF> &
     Traversable<EitherF>)
}
