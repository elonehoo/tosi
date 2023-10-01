import type { InferType, Schema, Type } from '../types'
import { helpers } from '../helpers'
import { parse } from '../util'
import { objectType } from './object'

export function recordType<
  TType extends Type<unknown>,
  TReturn = Record<string, InferType<TType>>,
>(type: TType): Type<TReturn> {
  parse<object>('object', type)

  return {
    ...helpers(),
    parse(input: unknown) {
      const schema: Schema = {}
      const inputObj = parse<TReturn>('object', input)

      // @ts-expect-error no index signature
      Object.keys(inputObj).forEach(key => (schema[key] = type))

      return objectType(schema).parse(input) as TReturn
    },
  }
}
