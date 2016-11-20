# Features

- statically type checked by [Flow](https://flowtype.org/)
- PureScript-like standard library
- [static land](https://github.com/rpominov/static-land) compatible

The idea (faking higher kinded types in Flow) is based on the paper [Lightweight higher-kinded polymorphism](https://www.cl.cam.ac.uk/~jdy22/papers/lightweight-higher-kinded-polymorphism.pdf) and [elm-brands](https://github.com/joneshf/elm-brands).

- `Semigroup`
- `Monoid`
- `Functor`
- `Applicative`
- `Monad`
- `Foldable`
- `Traversable`
- `ChainRec`
- `Alternative`
- `Eff`
- `Arr`
- `Maybe`
- `Either`
- `Task`
- `State`
- `Writer`
- `Reader`

and many more...

# Example

```js
import * as maybe from 'flow-static-land/lib/Maybe'
import * as arr from 'flow-static-land/lib/Arr'

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

# Related blog posts

- [Higher kinded types with Flow](https://medium.com/@gcanti/higher-kinded-types-in-flow-275b657992b7)
- [Expressing side effects with the `Eff` monad](https://medium.com/@gcanti/the-eff-monad-implemented-in-flow-40803670c3eb)
- [Phantom types with Flow](https://medium.com/@gcanti/phantom-types-with-flow-828aff73232b)

# More examples

`examples` directory:

- a Signal library ([purescript-signal](https://github.com/bodil/purescript-signal) porting)
- a QuickCheck library ([purescript-quickcheck](https://github.com/purescript/purescript-quickcheck) partial porting)

# Setup

```sh
npm install flow-static-land --save
```

Babel config

```json
{
  "presets": ["es2015"],
  "plugins" : [
    "syntax-flow",
    "transform-flow-strip-types",
    "transform-class-properties"
  ]
}
```

# License

The MIT License (MIT)
