// @flow
export class HKT<F, A> {}

export type HKT2<F, A, B> = HKT<HKT<F, A>, B>;

