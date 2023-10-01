import { expect, test } from 'vitest'
import { t } from 'tosi'

test('nan() infer', () => {
  const type = t.nan()
  type Type = t.infer<typeof type>
  const assertType: t.AssertEqual<Type, number> = true
  assertType

  const value = type.parse(Number.NaN)
  const assertValue: t.AssertEqual<typeof value, Type> = true
  assertValue
})

test('nan()', () => {
  expect(t.nan().parse(Number.NaN)).toBe(Number.NaN)
  expect(t.nan().parse(Number('forty-two'))).toBe(Number.NaN)
  expect(() => t.nan().parse(0)).toThrow('expected \'NaN\' got \'number\'')
  expect(() => t.nan().parse(null)).toThrow('expected \'NaN\' got \'null\'')
  expect(() => t.nan().parse(Number.POSITIVE_INFINITY)).toThrow(
    'expected \'NaN\' got \'Infinity\'',
  )
})
