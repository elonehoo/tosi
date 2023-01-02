import { expect, test } from 'vitest'
import * as t from 'tosi'

test('unknown()', () => {
  expect(t.unknown().check(42)).toBe(42)
})

test('string()', () => {
  expect(t.string().check('42')).toBe('42')
  expect(() => t.string().check(42)).toThrow('expected \'string\' got \'number\'')
})

test('number()', () => {
  expect(t.number().check(42)).toBe(42)
  expect(() => t.number().check('42')).toThrow(
    'expected \'number\' got \'string\'',
  )
})

test('boolean()', () => {
  expect(t.boolean().check(40 + 2 === 42)).toBe(true)
  expect(() => t.boolean().check(Symbol(42))).toThrow(
    'expected \'boolean\' got \'symbol\'',
  )
})

test('object()', () => {
  const input = { life: 42, name: 'prout' }
  const schema = { life: t.number(), name: t.string() }
  expect(t.object(schema).check(input)).toBe(input)
  expect(() => t.object(schema).check(Error)).toThrow(
    'expected \'object\' got \'function\'',
  )
})

test('object(): with error on first level', () => {
  const input = { life: 42, name: ['prout'] }
  const schema = { life: t.number(), name: t.string() }
  expect(() => t.object(schema).check(input)).toThrow(
    'expected \'string\' got \'array\' from \'name\'',
  )
})

test('object(): with two levels', () => {
  const input = { life: 42, name: 'prout', data: { size: 24, verbose: true } }
  const schema = t.object({
    life: t.number(),
    name: t.string(),
    data: t.object({ size: t.number(), verbose: t.boolean() }),
  })
  expect(schema.check(input)).toBe(input)
})

test('object(): with error on second level', () => {
  const input = {
    life: 42,
    name: 'prout',
    data: { size: 24, verbose: 'true' },
  }
  const schema = t.object({
    life: t.number(),
    name: t.string(),
    data: t.object({ size: t.number(), verbose: t.boolean() }),
  })
  expect(() => schema.check(input)).toThrow(
    'expected \'boolean\' got \'string\' from \'data.verbose\'',
  )
})

test('object(): with invalid input', () => {
  const input = { life: 42, name: ['prout'] }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  expect(() => t.object(input).check(input)).toThrow(
    'p.check is not a function',
  )
})

test('optional(string())', () => {
  const optional = t.optional(t.string())
  expect(optional.check('42')).toBe('42')
  expect(optional.check(undefined)).toBe(undefined)
  expect(() => optional.check(42)).toThrow('expected \'string\' got \'number\'')
  expect(() => optional.check(null)).toThrow('expected \'string\' got \'null\'')
})
