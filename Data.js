// @flow

export class Data1<A> {
  value0: A;
  constructor(value0: A) {
    this.value0 = value0
  }
}

export class Data2<A, B> {
  value0: A;
  value1: B;
  constructor(value0: A, value1: B) {
    this.value0 = value0
    this.value1 = value1
  }
}

export class Data3<A, B, C> {
  value0: A;
  value1: B;
  value2: C;
  constructor(value0: A, value1: B, value2: C) {
    this.value0 = value0
    this.value1 = value1
    this.value2 = value2
  }
}

export class Data4<A, B, C, D> {
  value0: A;
  value1: B;
  value2: C;
  value3: D;
  constructor(value0: A, value1: B, value2: C, value3: D) {
    this.value0 = value0
    this.value1 = value1
    this.value2 = value2
    this.value3 = value3
  }
}

export class Data5<A, B, C, D, E> {
  value0: A;
  value1: B;
  value2: C;
  value3: D;
  value4: E;
  constructor(value0: A, value1: B, value2: C, value3: D, value4: E) {
    this.value0 = value0
    this.value1 = value1
    this.value2 = value2
    this.value3 = value3
    this.value4 = value4
  }
}
