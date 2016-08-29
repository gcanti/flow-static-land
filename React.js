// @flow
import { HKT } from './HKT'
import type { Contravariant } from './Contravariant'
import type { Arr } from './Arr'
import * as arr from './Arr'
import React from 'react'

class IsReactComponent {}

export type FunctionComponent<A> = (props: A) => ?React$Element<any>;

export type ComponentClass<D, P, S> = Class<React$Component<D, P, S>>;

export type ReactComponentV<A> = ComponentClass<void, A, void> | FunctionComponent<A>;

export type ReactComponent<A> = HKT<IsReactComponent, A>;

export function inj<A>(a: ReactComponentV<A>): ReactComponent<A> {
  return ((a: any): ReactComponent<A>)
}

export function prj<A>(fa: ReactComponent<A>): ReactComponentV<A> {
  return ((fa: any): ReactComponentV<A>)
}

export function injMany<A>(as: Array<ReactComponentV<A>>): Arr<ReactComponent<A>> {
  return arr.inj(as.map(inj))
}

export function prjMany<A>(as: Arr<ReactComponent<A>>): Array<ReactComponentV<A>> {
  return arr.prj(arr.map(prj, as))
}

export function contramap<A, B>(f: (a: B) => A, fa: ReactComponent<A>): ReactComponent<B> {
  const Fa = prj(fa) // eslint-disable-line no-unused-vars
  return inj(b => <Fa {...f(b)} />)
}

export function removeDefaults<D, P, S>(C: ComponentClass<D, P, S>): ComponentClass<void, P, S> {
  return ((C: any): ComponentClass<void, P, S>)
}

export function addDefaults<P, D: $Shape<P>, S, R: ComponentClass<void, $Diff<P, D>, S>>(defaults: D, C: ComponentClass<void, P, S>): R { // eslint-disable-line no-unused-vars
  const f = b => <C {...Object.assign({}, defaults, b)} />
  return ((f: any): R)
}

export function setProps<D, P>(props: D, C: ReactComponent<D & P>): ReactComponent<P> {
  return contramap(b => Object.assign({}, b, props), C)
}

export function addSCU<A>(scu: (props: A, nextProps: A) => boolean, fa: ReactComponent<A>): ReactComponent<A> {
  const Fa = prj(fa) // eslint-disable-line no-unused-vars
  return inj(class extends React.Component {
    shouldComponentUpdate(nextProps) {
      return scu(this.props, nextProps)
    }
    render() {
      return <Fa {...this.props} />
    }
  })
}

if (false) { // eslint-disable-line
  ({
    contramap
  }: Contravariant<IsReactComponent>)
}
