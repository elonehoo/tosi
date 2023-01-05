import { expect, test } from 'vitest'
import { tosi } from 'tosi'

test('instanceof()', () => {
  class MyClass {}
  const instance = new MyClass()
  expect(tosi.instanceof(MyClass).parse(instance)).toBe(instance)
  expect(() => tosi.instanceof(MyClass).parse(new Date())).toThrow(
    'expected \'MyClass\' got \'object\'',
  )
})

test('date() Date', () => {
  const date = new Date()
  expect(tosi.date().parse(date)).toBe(date)
  expect(() => tosi.date().parse(Date)).toThrow('expected \'Date\' got \'function\'')
  expect(() => tosi.date().parse(Date.now())).toThrow(
    'expected \'Date\' got \'number\'',
  )
})

test('date() string', () => {
  const date = '2022-03-11T09:28:00.575Z'
  expect(tosi.date().parse(date)).toBe(date)
  expect(() => tosi.date().parse('Date')).toThrow('expected \'Date\' got \'string\'')
  expect(() => tosi.date().parse(Date.now())).toThrow(
    'expected \'Date\' got \'number\'',
  )
})

test('nan()', () => {
  expect(tosi.nan().parse(NaN)).toBe(NaN)
  expect(tosi.nan().parse(Number('forty-two'))).toBe(NaN)
  expect(() => tosi.nan().parse(0)).toThrow('expected \'NaN\' got \'number\'')
  expect(() => tosi.nan().parse(null)).toThrow('expected \'NaN\' got \'null\'')
  expect(() => tosi.nan().parse(Infinity)).toThrow(
    'expected \'NaN\' got \'Infinity\'',
  )
})

test('infinity()', () => {
  expect(tosi.infinity().parse(Infinity)).toBe(Infinity)
  expect(tosi.infinity().parse(-Infinity)).toBe(-Infinity)
  expect(tosi.infinity().parse(Number.MAX_VALUE * 42)).toBe(Infinity)
  expect(() => tosi.infinity().parse(0)).toThrow(
    'expected \'Infinity\' got \'number\'',
  )
  expect(() => tosi.infinity().parse(null)).toThrow(
    'expected \'Infinity\' got \'null\'',
  )
})

test('finite()', () => {
  expect(tosi.finite().parse(0)).toBe(0)
  expect(tosi.finite().parse(42)).toBe(42)
  expect(tosi.finite().parse(-42)).toBe(-42)
  expect(tosi.finite().parse(+42.42)).toBe(+42.42)
  expect(tosi.finite().parse(-42.42)).toBe(-42.42)
  expect(() => tosi.finite().parse(42n)).toThrow(
    'expected \'finite number\' got \'bigint\'',
  )
  expect(() => tosi.finite().parse(null)).toThrow(
    'expected \'finite number\' got \'null\'',
  )
  expect(() => tosi.finite().parse(Infinity)).toThrow(
    'expected \'finite number\' got \'Infinity\'',
  )
})

test('integer()', () => {
  expect(tosi.integer().parse(0)).toBe(0)
  expect(tosi.integer().parse(42)).toBe(42)
  expect(tosi.integer().parse(-42)).toBe(-42)
  expect(() => tosi.integer().parse(42n)).toThrow(
    'expected \'integer\' got \'bigint\'',
  )
  expect(() => tosi.integer().parse(null)).toThrow(
    'expected \'integer\' got \'null\'',
  )
  expect(() => tosi.integer().parse(Infinity)).toThrow(
    'expected \'integer\' got \'Infinity\'',
  )
})

test('unsignedInteger()', () => {
  expect(tosi.unsignedInteger().parse(0)).toBe(0)
  expect(tosi.unsignedInteger().parse(42)).toBe(42)
  expect(() => tosi.unsignedInteger().parse(-42)).toThrow(
    'expected \'unsigned integer\' got \'number\'',
  )
  expect(() => tosi.unsignedInteger().parse(0.1)).toThrow(
    'expected \'unsigned integer\' got \'number\'',
  )
  expect(() => tosi.unsignedInteger().parse(42n)).toThrow(
    'expected \'unsigned integer\' got \'bigint\'',
  )
  expect(() => tosi.unsignedInteger().parse(null)).toThrow(
    'expected \'unsigned integer\' got \'null\'',
  )
  expect(() => tosi.unsignedInteger().parse(Infinity)).toThrow(
    'expected \'unsigned integer\' got \'Infinity\'',
  )
})

test('unsignedNumber()', () => {
  expect(tosi.unsignedNumber().parse(0)).toBe(0)
  expect(tosi.unsignedNumber().parse(42)).toBe(42)
  expect(tosi.unsignedNumber().parse(0.1)).toBe(0.1)
  expect(tosi.unsignedNumber().parse(42.42)).toBe(42.42)
  expect(() => tosi.unsignedNumber().parse(-42)).toThrow(
    'expected \'unsigned number\' got \'number\'',
  )
  expect(() => tosi.unsignedNumber().parse(42n)).toThrow(
    'expected \'unsigned number\' got \'bigint\'',
  )
  expect(() => tosi.unsignedNumber().parse(null)).toThrow(
    'expected \'unsigned number\' got \'null\'',
  )
  expect(() => tosi.unsignedNumber().parse(Infinity)).toThrow(
    'expected \'unsigned number\' got \'Infinity\'',
  )
})

test('literal(boolean)', () => {
  const literal = tosi.literal(true)
  expect(literal.parse(true)).toBe(true)
  expect(() => literal.parse(null)).toThrow('expected \'boolean\' got \'null\'')
})

test('literal(string)', () => {
  const literal = tosi.literal('42')
  expect(literal.parse('42')).toBe('42')
  expect(() => literal.parse(true)).toThrow('expected \'string\' got \'boolean\'')
})

test('literal(number)', () => {
  const literal = tosi.literal(42)
  expect(literal.parse(42)).toBe(42)
  expect(() => literal.parse('42')).toThrow('expected \'number\' got \'string\'')
})

test('literal(bigint)', () => {
  const literal = tosi.literal(BigInt(42))
  expect(literal.parse(42n)).toBe(42n)
  expect(() => literal.parse(null)).toThrow('expected \'bigint\' got \'null\'')
})

test('literal(symbol)', () => {
  const life = Symbol(42)
  const literal = tosi.literal(life)
  expect(literal.parse(life)).toBe(life)
  expect(() => literal.parse(42n)).toThrow('expected \'symbol\' got \'bigint\'')
})

test('literal(null)', () => {
  const literal = tosi.literal(null)
  expect(literal.parse(null)).toBe(null)
  expect(() => literal.parse(0)).toThrow('expected \'null\' got \'number\'')
})

test('literal(undefined)', () => {
  const literal = tosi.literal(undefined)
  expect(literal.parse(undefined)).toBe(undefined)
  expect(() => literal.parse(null)).toThrow('expected \'undefined\' got \'null\'')
})

test('literal(...) invalid value', () => {
  expect(() => tosi.literal([42])).toThrow(
    'expected \'string|number|bigint|boolean|symbol|null|undefined\' got \'array\'',
  )
})

test('void()', () => {
  expect(tosi.void().parse()).toBe(undefined)
  expect(tosi.void().parse(undefined)).toBe(undefined)
  expect(() => tosi.void().parse(null)).toThrow('expected \'undefined\' got \'null\'')
  expect(() => tosi.void().parse(0)).toThrow('expected \'undefined\' got \'number\'')
})

test('any()', () => {
  expect(tosi.any().parse(42)).toBe(42)
})

test('never()', () => {
  expect(() => tosi.never().parse()).toThrow('expected \'never\' got \'undefined\'')
})

test('array()', () => {
  const input = [1, 2, 3, 4, 5]
  const schema = tosi.array(tosi.number())
  expect(schema.parse(input)).toBe(input)
  expect(() => schema.parse([...input, '42'])).toThrow(
    'expected \'number\' got \'string\' at index \'5\'',
  )
})

test('array() invalid input', () => {
  const schema = tosi.array(true)
  expect(() => schema.parse(['42'])).toThrow('e.parse is not a function')
})

test('tuple()', () => {
  const input: [number, string, boolean, string] = [42, 'plop', true, '42']
  const schema = tosi.tuple(tosi.number(), tosi.string(), tosi.boolean(), tosi.string())
  expect(schema.parse(input)).toBe(input)
  expect(() => schema.parse([42, 24, true, '42'])).toThrow(
    'expected \'string\' got \'number\' at index \'1\'',
  )
  expect(() => schema.parse([42, 'plop', true, '42', 'overflow'])).toThrow(
    'expected length to be \'4\' got \'5\'',
  )
  expect(() => schema.parse([42, 'plop', true])).toThrow(
    'expected length to be \'4\' got \'3\'',
  )
})

test('tuple() invalid input', () => {
  const schema = tosi.tuple(true)
  expect(() => schema.parse(['42'])).toThrow('r.parse is not a function')
})

test('bigint()', () => {
  expect(tosi.bigint().parse(42n)).toBe(42n)
  expect(tosi.bigint().parse(BigInt(42))).toBe(42n)
  expect(tosi.bigint().parse(BigInt(42))).toBe(BigInt(42))
  expect(() => tosi.bigint().parse('42')).toThrow(
    'expected \'bigint\' got \'string\'',
  )
})

test('symbol()', () => {
  const sym = Symbol(42)
  expect(tosi.symbol().parse(sym)).toBe(sym)
  expect(() => tosi.symbol().parse(42)).toThrow('expected \'symbol\' got \'number\'')
})

test('function()', () => {
  const f = (p: string) => p
  expect(tosi.function().parse(f)).toBe(f)
  expect(() => tosi.function().parse(42)).toThrow(
    'expected \'function\' got \'number\'',
  )
})

test('null()', () => {
  expect(tosi.null().parse(null)).toBe(null)
  expect(() => tosi.null().parse(0)).toThrow('expected \'null\' got \'number\'')
  expect(() => tosi.null().parse(undefined)).toThrow(
    'expected \'null\' got \'undefined\'',
  )
})

test('undefined()', () => {
  expect(tosi.undefined().parse(undefined)).toBe(undefined)
  expect(() => tosi.undefined().parse(null)).toThrow(
    'expected \'undefined\' got \'null\'',
  )
  expect(() => tosi.undefined().parse(0)).toThrow('expected \'undefined\' got \'number\'')
})

test('unknown()', () => {
  expect(tosi.unknown().parse(42)).toBe(42)
})

test('string()', () => {
  expect(tosi.string().parse('42')).toBe('42')
  expect(() => tosi.string().parse(42)).toThrow('expected \'string\' got \'number\'')
})

test('number()', () => {
  expect(tosi.number().parse(42)).toBe(42)
  expect(() => tosi.number().parse('42')).toThrow(
    'expected \'number\' got \'string\'',
  )
})

test('boolean()', () => {
  expect(tosi.boolean().parse(40 + 2 === 42)).toBe(true)
  expect(() => tosi.boolean().parse(Symbol(42))).toThrow(
    'expected \'boolean\' got \'symbol\'',
  )
})

test('object()', () => {
  const input = { life: 42, name: 'prout' }
  const schema = { life: tosi.number(), name: tosi.string() }
  expect(tosi.object(schema).parse(input)).toBe(input)
  expect(() => tosi.object(schema).parse(Error)).toThrow(
    'expected \'object\' got \'function\'',
  )
})

test('object(): with error on first level', () => {
  const input = { life: 42, name: ['prout'] }
  const schema = { life: tosi.number(), name: tosi.string() }
  expect(() => tosi.object(schema).parse(input)).toThrow(
    'expected \'string\' got \'array\' from \'name\'',
  )
})

test('object(): with two levels', () => {
  const input = { life: 42, name: 'prout', data: { size: 24, verbose: true } }
  const schema = tosi.object({
    life: tosi.number(),
    name: tosi.string(),
    data: tosi.object({ size: tosi.number(), verbose: tosi.boolean() }),
  })
  expect(schema.parse(input)).toBe(input)
})

test('object(): with error on second level', () => {
  const input = {
    life: 42,
    name: 'prout',
    data: { size: 24, verbose: 'true' },
  }
  const schema = tosi.object({
    life: tosi.number(),
    name: tosi.string(),
    data: tosi.object({ size: tosi.number(), verbose: tosi.boolean() }),
  })
  expect(() => schema.parse(input)).toThrow(
    'expected \'boolean\' got \'string\' from \'data.verbose\'',
  )
})

test('object(): with invalid input', () => {
  const input = { life: 42, name: ['prout'] }
  expect(() => tosi.object(input).parse(input)).toThrow(
    's.parse is not a function',
  )
})

test('optional(string())', () => {
  const optional = tosi.optional(tosi.string())
  expect(optional.parse('42')).toBe('42')
  expect(optional.parse(undefined)).toBe(undefined)
  expect(() => optional.parse(42)).toThrow(
    'expected \'string|undefined\' got \'number\'',
  )
  expect(() => optional.parse(null)).toThrow(
    'expected \'string|undefined\' got \'null\'',
  )
})

test('optional(): with invalid input', () => {
  expect(() => tosi.optional(42).parse(42)).toThrow(
    'e.parse is not a function',
  )
})

test('nullable(string())', () => {
  const nullable = tosi.nullable(tosi.string())
  expect(nullable.parse('42')).toBe('42')
  expect(nullable.parse(null)).toBe(null)
  expect(() => nullable.parse([42])).toThrow(
    'expected \'string|null\' got \'array\'',
  )
  expect(() => nullable.parse(0)).toThrow(
    'expected \'string|null\' got \'number\'',
  )
})

test('nullable(): with invalid input', () => {
  expect(() => tosi.nullable(42).parse(42)).toThrow(
    'e.parse is not a function',
  )
})

test('union()', () => {
  const str = tosi.string()
  const num = tosi.number()
  const boo = tosi.boolean()
  const uni = tosi.union([str, num, boo, str])
  expect(uni.parse(42)).toBe(42)
  expect(uni.parse('42')).toBe('42')
  expect(uni.parse(40 + 2 === 42)).toBe(true)
  expect(() => uni.parse(undefined)).toThrow(
    'expected \'string|number|boolean\' got \'undefined\'',
  )
  expect(() => uni.parse(null)).toThrow(
    'expected \'string|number|boolean\' got \'null\'',
  )
})

test('union(): with optional', () => {
  const str = tosi.string()
  const num = tosi.number()
  const boo = tosi.boolean()
  const uni = tosi.optional(tosi.union([str, num, boo]))
  expect(uni.parse(undefined)).toBe(undefined)
  expect(() => uni.parse(null)).toThrow(
    'expected \'string|number|boolean|undefined\' got \'null\'',
  )
})

test('union(): with optional in object', () => {
  const str = tosi.string()
  const num = tosi.number()
  const boo = tosi.boolean()
  const obj = tosi.object({
    name: tosi.string(),
    desc: tosi.optional(tosi.union([str, num, boo])),
  })
  let input: object = { name: 'nyan' }
  expect(obj.parse(input)).toBe(input)
  input = { name: 'nyan', desc: 42 }
  expect(obj.parse(input)).toBe(input)
  input = { name: 'nyan', desc: '42' }
  expect(obj.parse(input)).toBe(input)
  input = { name: 'nyan', desc: false }
  expect(obj.parse(input)).toBe(input)
  input = { name: 'nyan', desc: Symbol(42) }
  expect(() => obj.parse(input)).toThrow(
    'expected \'string|number|boolean|undefined\' got \'symbol\' from \'desc\'',
  )
})
