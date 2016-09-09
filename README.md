# Features

- statically type checked by [Flow](https://flowtype.org/)
- PureScript-like standard library
- static land compatible ([Specification](https://github.com/rpominov/static-land))

The idea (faking higher kinded types in Flow) is based on the paper [Lightweight higher-kinded polymorphism](https://www.cl.cam.ac.uk/~jdy22/papers/lightweight-higher-kinded-polymorphism.pdf) and [elm-brands](https://github.com/joneshf/elm-brands).

# Try it out

```
git clone https://github.com/gcanti/flow-static-land.git
cd flow-static-land
npm install
npm start

# execute ./node_modules/.bin/babel-node playground/index.js
# or open the page playground/index.html in a browser
# then edit playground/index.js
```

# Examples

Real world examples

- a Signal library ([purescript-signal](https://github.com/bodil/purescript-signal) porting)
- a QuickCheck library ([purescript-quickcheck](https://github.com/purescript/purescript-quickcheck) partial porting)

## `Maybe` and `Arr`

```js
import * as maybe from 'flow-static-land/Maybe'
import * as arr from 'flow-static-land/Arr'

const f = (n) => n * 2
const g = (n) => n + 1

// functor
maybe.map(f, maybe.Nothing) // => null
maybe.map(f, maybe.of(3)) // => 6

const a1 = arr.inj([f, g])
const a2 = arr.inj([1, 2, 3])

// applicative
arr.ap(a1, a2) // => [2, 4, 6, 2, 3, 4]
```

Statically type checked

```js
maybe.map(f, maybe.of('s'))
```

Error

```
maybe.map(f, maybe.of('s'))
                  ^^^^^^^^^^^^^ call of method `of`
const f = (n) => n * 2
                 ^ string. This type is incompatible with
const f = (n) => n * 2
                 ^^^^^ number
```

## Expressing side effects with the `Eff` monad

See this [blog post](https://medium.com/@gcanti/the-eff-monad-implemented-in-flow-40803670c3eb#.sj4m00hpe) for context

```js
import type { Eff } from 'flow-static-land/Eff'
import { inj } from 'flow-static-land/Eff'

class DB {}

type User = {
  username: string,
  uid: number
};

const users = {}
let uid = 0

function createUser(username: string): Eff<{ write: DB }, User> {
  return inj(() => {
    users[username] = { username, uid: ++uid }
    return users[username]
  })
}

function lookupUser(username: string): Eff<{ read: DB }, ?User> {
  return inj(() => users[username])
}

// the signature shows that createThenLookupUser will read and write to the db
const createThenLookupUser: (username: string) => Eff<{ read: DB, write: DB }, ?User> =
  username => chain(user => lookupUser(user.username), createUser(username))
```

# Setup

Download the source code with the command `npm i gcanti/flow-static-land#master`

**Bundles**

In order to build a bundle, add the following plugins to your `.babelrc` file

```
{
  "presets": ["es2015"],
  "plugins" : [
    "syntax-flow",
    "transform-flow-strip-types",
    "transform-class-properties"
  ]
}
```

For webpack, add the following include to your babel loader

```js
{
  loader: 'babel',
  include: [
    path.resolve(__dirname, "node_modules/flow-static-land"),
    path.resolve(__dirname, "path/to/your/code")
  ]
}
```

