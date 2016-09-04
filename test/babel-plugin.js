/* global describe,it */
import assert from 'assert'
import * as babel from 'babel-core'

// experimental simple babel plugin
const plugin = function ({ types: t }) {

  function getCalleeName(node) {
    if (t.isMemberExpression(node)) {
      return getCalleeName(node.property)
    }
    return node.name
  }

  function shouldStrip(node) {
    const name = getCalleeName(node.callee)
    return node.arguments.length === 1 && ( name === 'prj' || name === 'inj')
  }

  return {
    visitor: {
      CallExpression(path){
        const node = path.node
        if (shouldStrip(node)) {
          path.replaceWith(node.arguments[0])
        }
      }
    }
  }

}

function trim(str) {
  return str.replace(/^\s+|\s+$/g, '')
}

function assertTransformEqual(source, expected) {
  const actual = babel.transform(
    source, {
      babelrc: false,
      plugins: [
        'syntax-flow',
        plugin
      ]
    }
  ).code
  assert.equal(trim(actual), trim(expected))
}

describe('babel plugin', () => {

  it('should strip prj() calls', () => {
    assertTransformEqual(`prj(x);`, `x;`)
  })

  it('should strip inj() calls', () => {
    assertTransformEqual(`inj(x);`, `x;`)
  })

  it('should strip both inj() and prj() calls', () => {
    assertTransformEqual(`
export function map<A, B>(f: (a: A) => B, fa: Arr<A>): Arr<B> {
  return inj(prj(fa).map(f))
}`, `
export function map<A, B>(f: (a: A) => B, fa: Arr<A>): Arr<B> {
  return fa.map(f);
}`)
    assertTransformEqual(`
import * as maybe from 'flow-static-land/Maybe'

function foo(x) {
  return maybe.prj(x)
}
`, `
import * as maybe from 'flow-static-land/Maybe';

function foo(x) {
  return x;
}
`)
  })

})
