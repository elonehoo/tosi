import { helpers } from '../helpers'
import type { Type } from '../types'

export function unknownType(): Type<unknown> {
  return {
    ...helpers(),
    parse(input: unknown): unknown {
      return input
    },
  }
}
