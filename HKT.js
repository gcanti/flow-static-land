// @flow
export class HKT<F, A> {} // eslint-disable-line

export type HKT2<F, A, B> = HKT<HKT<F, A>, B>;

