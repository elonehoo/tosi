import { expect, test } from 'vitest'
import { tosi } from 'tosi'

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
  // @ts-expect-error invalid value
  expect(() => tosi.literal([42])).toThrow(
    'expected \'string|number|bigint|boolean|symbol|null|undefined\' got \'array\'',
  )
})

test('void()', () => {
  // @ts-expect-error no parse value
  expect(tosi.void().parse()).toBe(undefined)
  expect(tosi.void().parse(undefined)).toBe(undefined)
  expect(() => tosi.void().parse(null)).toThrow('expected \'undefined\' got \'null\'')
  expect(() => tosi.void().parse(0)).toThrow('expected \'undefined\' got \'number\'')
})

test('any()', () => {
  expect(tosi.any().parse(42)).toBe(42)
})

test('never()', () => {
  // @ts-expect-error no parse value
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
  // @ts-expect-error invalid input
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
  // @ts-expect-error invalid input
  const schema = tosi.tuple(true)
  expect(() => schema.parse(['42'])).toThrow('n.parse is not a function')
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
  // @ts-expect-error input type not assignable
  expect(() => tosi.object(input).parse(input)).toThrow(
    'T.parse is not a function',
  )
})

test('optional(string())', () => {
  const optional = tosi.optional(tosi.string())
  expect(optional.parse('42')).toBe('42')
  expect(optional.parse(undefined)).toBe(undefined)
  expect(() => optional.parse(42)).toThrow('expected \'string\' got \'number\'')
  expect(() => optional.parse(null)).toThrow('expected \'string\' got \'null\'')
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
    'expected \'string|number|boolean\' got \'null\'',
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
    'expected \'string|number|boolean\' got \'symbol\'',
  )
})
