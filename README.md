Static land compatible

- [Specification](https://github.com/rpominov/static-land)

The idea (faking higher kinded types in Flow) is based on the paper [Lightweight higher-kinded polymorphism](https://www.cl.cam.ac.uk/~jdy22/papers/lightweight-higher-kinded-polymorphism.pdf) and [elm-brands](https://github.com/joneshf/elm-brands).

# Setup

Download the source code

```
npm i gcanti/flow-static-land#master
```

**Flow**

Add the following include to your `.flowconfig` file

```
[include]
./node_modules/flow-static-land/
```

**Webpack**

Add the following include to your babel loader

```js
{
  loader: 'babel',
  include: [
    path.resolve(__dirname, "node_modules/flow-static-land"),
    path.resolve(__dirname, "path/to/your/code")
  ]
}
```

# Example

```js
import * as Maybe from 'flow-static-land/Maybe'
import * as Arr from 'flow-static-land/Arr'

const f = (n) => n * 2
const g = (n) => n + 1

Maybe.map(f, Maybe.Nothing) // => null
Maybe.map(f, Maybe.of(3)) // => 6

Arr.ap(Arr.inj([f, g]), Arr.inj([1, 2, 3])) // => [2, 4, 6, 2, 3, 4]
```

# Statically type checked (Flow)

```js
Maybe.map(f, Maybe.of('s'))
```

Error

```
Maybe.map(f, Maybe.of('s'))
                  ^^^^^^^^^^^^^ call of method `of`
const f = (n) => n * 2
                 ^ string. This type is incompatible with
const f = (n) => n * 2
                 ^^^^^ number
```