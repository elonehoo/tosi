import { expect, test } from 'vitest'
import {tosi} from 'tosi'

test('array()', () => {
  const input = [1, 2, 3, 4, 5]
  const schema = tosi.array(tosi.number())
  expect(schema.check(input)).toBe(input)
  expect(() => schema.check([...input, '42'])).toThrow(
    'expected \'number\' got \'string\' at index \'5\'',
  )
})

test('tuple()', () => {
  const input: [number, string, boolean, string] = [42, 'plop', true, '42']
  const schema = tosi.tuple(tosi.number(), tosi.string(), tosi.boolean(), tosi.string())
  expect(schema.check(input)).toBe(input)
  expect(() => schema.check([42, 24, true, '42'])).toThrow(
    'expected \'string\' got \'number\' at index \'1\'',
  )
  expect(() => schema.check([42, 'plop', true, '42', 'overflow'])).toThrow(
    'expected length to be \'4\' got \'5\'',
  )
  expect(() => schema.check([42, 'plop', true])).toThrow(
    'expected length to be \'4\' got \'3\'',
  )
})

test('bigint()', () => {
  expect(tosi.bigint().check(42n)).toBe(42n)
  expect(tosi.bigint().check(BigInt(42))).toBe(42n)
  expect(tosi.bigint().check(BigInt(42))).toBe(BigInt(42))
  expect(() => tosi.bigint().check('42')).toThrow(
    'expected \'bigint\' got \'string\'',
  )
})

test('symbol()', () => {
  const sym = Symbol(42)
  expect(tosi.symbol().check(sym)).toBe(sym)
  expect(() => tosi.symbol().check(42)).toThrow('expected \'symbol\' got \'number\'')
})

test('func()', () => {
  const f = (p: string) => p
  expect(tosi.function().check(f)).toBe(f);
  expect(() => tosi.function().check(42)).toThrow(
    "expected 'function' got 'number'",
  );
})

test('nul()', () => {
  expect(tosi.null().check(null)).toBe(null)
  expect(() => tosi.null().check(0)).toThrow('expected \'null\' got \'number\'')
  expect(() => tosi.null().check(undefined)).toThrow(
    'expected \'null\' got \'undefined\'',
  )
})

test('undef()', () => {
  expect(tosi.undefined().check(undefined)).toBe(undefined)
  expect(() => tosi.undefined().check(null)).toThrow(
    'expected \'undefined\' got \'null\'',
  )
  expect(() => tosi.undefined().check(0)).toThrow('expected \'undefined\' got \'number\'')
})

test('unknown()', () => {
  expect(tosi.unknown().check(42)).toBe(42)
})

test('string()', () => {
  expect(tosi.string().check('42')).toBe('42')
  expect(() => tosi.string().check(42)).toThrow('expected \'string\' got \'number\'')
})

test('number()', () => {
  expect(tosi.number().check(42)).toBe(42)
  expect(() => tosi.number().check('42')).toThrow(
    'expected \'number\' got \'string\'',
  )
})

test('boolean()', () => {
  expect(tosi.boolean().check(40 + 2 === 42)).toBe(true)
  expect(() => tosi.boolean().check(Symbol(42))).toThrow(
    'expected \'boolean\' got \'symbol\'',
  )
})

test('object()', () => {
  const input = { life: 42, name: 'prout' }
  const schema = { life: tosi.number(), name: tosi.string() }
  expect(tosi.object(schema).check(input)).toBe(input)
  expect(() => tosi.object(schema).check(Error)).toThrow(
    'expected \'object\' got \'function\'',
  )
})

test('object(): with error on first level', () => {
  const input = { life: 42, name: ['prout'] }
  const schema = { life: tosi.number(), name: tosi.string() }
  expect(() => tosi.object(schema).check(input)).toThrow(
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
  expect(schema.check(input)).toBe(input)
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
  expect(() => schema.check(input)).toThrow(
    'expected \'boolean\' got \'string\' from \'data.verbose\'',
  )
})

test('object(): with invalid input', () => {
  const input = { life: 42, name: ['prout'] }
  // @ts-expect-error input type not assignable
  expect(() => t.object(input).check(input)).toThrow(
    't is not defined',
  )
})

test('optional(string())', () => {
  const optional = tosi.optional(tosi.string())
  expect(optional.check('42')).toBe('42')
  expect(optional.check(undefined)).toBe(undefined)
  expect(() => optional.check(42)).toThrow('expected \'string\' got \'number\'')
  expect(() => optional.check(null)).toThrow('expected \'string\' got \'null\'')
})

test('union()', () => {
  const str = tosi.string()
  const num = tosi.number()
  const boo = tosi.boolean()
  const uni = tosi.union([str, num, boo, str])
  expect(uni.check(42)).toBe(42)
  expect(uni.check('42')).toBe('42')
  expect(uni.check(40 + 2 === 42)).toBe(true)
  expect(() => uni.check(undefined)).toThrow(
    'expected \'string|number|boolean\' got \'undefined\'',
  )
  expect(() => uni.check(null)).toThrow(
    'expected \'string|number|boolean\' got \'null\'',
  )
})

test('union(): with optional', () => {
  const str = tosi.string()
  const num = tosi.number()
  const boo = tosi.boolean()
  const uni = tosi.optional(tosi.union([str, num, boo]))
  expect(uni.check(undefined)).toBe(undefined)
  expect(() => uni.check(null)).toThrow(
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
  expect(obj.check(input)).toBe(input)
  input = { name: 'nyan', desc: 42 }
  expect(obj.check(input)).toBe(input)
  input = { name: 'nyan', desc: '42' }
  expect(obj.check(input)).toBe(input)
  input = { name: 'nyan', desc: false }
  expect(obj.check(input)).toBe(input)
  input = { name: 'nyan', desc: Symbol(42) }
  expect(() => obj.check(input)).toThrow(
    'expected \'string|number|boolean\' got \'symbol\'',
  )
})
