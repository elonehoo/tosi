# tosi

Type Safe Object Notation & Validation

# Features

- 🧱 Fonctional
- 🔷 Immutable
- ✅ Well tested

# Install

```bash
pnpm add tosi
```
_`yarn` and `npm` also work_


## ES and CommonJS module

```ts
import * as tosi from 'tosi'
```

```ts
const tosi = require('tosi')
```

# Examples

```ts
// ...
import { string } from 'tosi'
const name = string()
name.check('nyan') // return "nyan"
name.check(42) // throw TypeCheckError
```

```ts
import { boolean, number, object, string } from 'tosi'
const user = object({
  name: string(),
  age: number(),
  admin: boolean(),
})
user.check({ name: 'nyan', age: 42, admin: true })
type User = InferType<typeof user>
// { name: string, age: number, admin: boolean }
```

# API

## Types

- `string()`
- `number()`
- `bigint()`
- `boolean()`
- `symbol()`

- `nul()`
- `undef()`
- `unknown()`

- `func()`

- `array(type)`
- `tuple(...type)`
- `object(object)`

## ...

- `union(type[])`
- `optional(type)`

# array(type)

```ts
const arr1 = array(string()) // string[]
const arr2 = array(boolean()) // boolean[]
```

# tuple(...type)

```ts
const tpl = tuple(string(), number()) // [string, number]
```

# object(object)

```ts
const user = object({
  name: string(),
  age: number(),
  admin: boolean(),
})
type User = InferType<typeof user>
// { name: string, age: number, admin: boolean }
```

# union(type[])

```ts
const uni = union(string(), number()) // string | number
```

# optional(type)

```ts
const user = object({
  name: string(),
  age: optional(number()),
})
// { name: string, age?: number }
```
