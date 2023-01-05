import { TypeParseError } from './errors'
import type { ParseType } from './types'

export function parse<TReturn>(type: ParseType, input: unknown): TReturn {
  if (typeOf(input) === type)
    return input as TReturn

  throw new TypeParseError(type, input)
}

export function typeOf(input: unknown): string {
  if (typeof input === 'undefined')
    return 'undefined'

  if (input === null)
    return 'null'

  if (Array.isArray(input))
    return 'array'

  return typeof input
}
