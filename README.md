Implementation of common algebraic types in JavaScript + Flow based on static-land

- [Specification](https://github.com/rpominov/static-land)

The idea (faking higher kinded types in Flow) is based on the paper [Lightweight higher-kinded polymorphism](https://www.cl.cam.ac.uk/~jdy22/papers/lightweight-higher-kinded-polymorphism.pdf) and [elm-brands](https://github.com/joneshf/elm-brands).

# Usage

```js
import * as Maybe from 'flow-static-land/Maybe'
import * as List from 'flow-static-land/List'

const f = (n) => n * 2
const g = (n) => n + 1

Maybe.map(f, Maybe.Nothing) // => null
Maybe.map(f, Maybe.of(3)) // => 6
Maybe.ap(Maybe.of(f), Maybe.of(3)) // => 6

List.ap(List.inj([f, g]), List.inj([1, 2, 3])) // => [2, 4, 6, 2, 3, 4]
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