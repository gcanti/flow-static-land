// @flow
export class HKT<F, A> {} // eslint-disable-line no-unused-vars

export type HKT2<F, A, B> = HKT<HKT<F, A>, B>;
