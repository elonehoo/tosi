import {
  ArrayTypeParseError,
  LengthMismatchError,
  ObjectTypeParseError,
  TypeParseError,
} from './errors'
import type {
  EnumKey,
  EnumLike,
  EnumOrFirstValue,
  EnumType,
  EnumValues,
  FakeEnum,
  InferTuple,
  InferType,
  Literal,
  LiteralType,
  ObjectType,
  Schema,
  Type,
  Unwrap,
  UnwrapSchema,
  UnwrapTuple,
} from './types'
import { parse, typeOf } from './util'

function literalType<TType extends Literal>(value: TType): LiteralType<TType> {
  const schema = unionType([
    stringType(),
    numberType(),
    bigintType(),
    booleanType(),
    symbolType(),
    nullType(),
    undefinedType(),
  ])

  schema.parse(value)

  return {
    value,
    parse(input: unknown): TType {
      schema.parse(input)

      if (input !== value)
        throw new TypeParseError(typeOf(value), input)

      return input as TType
    },
  }
}

function neverType(): Type<never> {
  return {
    parse(input: unknown): never {
      throw new TypeParseError('never', input)
    },
  }
}

function arrayType<TType extends Type<unknown>>(
  type: TType,
): Type<InferType<TType>[]> {
  return {
    parse(input: unknown[]): InferType<TType>[] {
      parse<InferType<TType>[]>('array', input)

      let lastId = 0

      try {
        input.forEach((value, id) => {
          lastId = id
          type.parse(value)
        })
      }
      catch (error) {
        if (error instanceof TypeParseError) {
          const path = [lastId.toString(), ...error.path]
          throw new ArrayTypeParseError(error.expected, error.input, path)
        }

        throw error
      }

      return input as InferType<TType>[]
    },
  }
}

function tupleType<TTypes extends Type<unknown>[]>(
  ...types: TTypes
): Type<UnwrapTuple<TTypes>> {
  return {
    parse(input: unknown[]): UnwrapTuple<TTypes> {
      parse<UnwrapTuple<TTypes>>('array', input)

      if (types.length !== input.length)
        throw new LengthMismatchError(types.length, input.length)

      let lastId = 0

      try {
        types.forEach((type, index) => {
          lastId = index
          type.parse(input[index])
        })
      }
      catch (error) {
        if (error instanceof TypeParseError) {
          const path = [lastId.toString(), ...error.path]
          throw new ArrayTypeParseError(error.expected, error.input, path)
        }

        throw error
      }

      return input as UnwrapTuple<TTypes>
    },
  }
}

function unknownType(): Type<unknown> {
  return {
    parse(input: unknown): unknown {
      return input
    },
  }
}

function stringType(): Type<string> {
  return {
    parse(input: unknown): string {
      return parse<string>('string', input)
    },
  }
}

function numberType(): Type<number> {
  return {
    parse(input: unknown): number {
      return parse<number>('number', input)
    },
  }
}

function bigintType(): Type<bigint> {
  return {
    parse(input: unknown): bigint {
      return parse<bigint>('bigint', input)
    },
  }
}

function symbolType(): Type<symbol> {
  return {
    parse(input: unknown): symbol {
      return parse<symbol>('symbol', input)
    },
  }
}

function functionType(): Type<Function> {
  return {
    parse<TType extends Function>(input: TType): TType {
      return parse<TType>('function', input)
    },
  }
}

function nullType(): Type<null> {
  return {
    parse(input: unknown): null {
      return parse<null>('null', input)
    },
  }
}

function undefinedType(): Type<undefined> {
  return {
    parse(input: unknown): undefined {
      return parse<undefined>('undefined', input)
    },
  }
}

function booleanType(): Type<boolean> {
  return {
    parse(input: unknown): boolean {
      return parse<boolean>('boolean', input)
    },
  }
}

function objectType<TInputSchema extends Schema>(
  schema: TInputSchema,
): ObjectType<UnwrapSchema<TInputSchema>> {
  return {
    schema,
    parse(input: unknown): UnwrapSchema<TInputSchema> {
      let lastCheckedKey = '?'

      try {
        const output = parse<UnwrapSchema<TInputSchema>>('object', input)

        Object.entries(schema).forEach(([key, val]) => {
          lastCheckedKey = key
          val.parse((input as TInputSchema)[key])
        })

        return output
      }
      catch (error) {
        if (error instanceof TypeParseError) {
          const path = [lastCheckedKey, ...error.path]
          throw new ObjectTypeParseError(error.expected, error.input, path)
        }

        throw error
      }
    },
  }
}

function optionalType<TType extends Type<InferType<TType>>>(
  type: TType,
): Type<InferType<TType> | undefined> {
  return {
    ...type,
    parse(input: unknown): InferType<TType> | undefined {
      if (typeof input === 'undefined')
        return undefined

      return type.parse(input)
    },
  }
}

function unionType<TTypes extends Type<InferTuple<TTypes>>[]>(
  types: TTypes,
): Type<InferTuple<TTypes>> {
  return {
    parse(input: unknown): InferTuple<TTypes> {
      const expectTypes: Set<string> = new Set()
      let errorCount = 0

      types.forEach((type) => {
        try {
          type.parse(input)
        }
        catch (error) {
          if (error instanceof TypeParseError)
            expectTypes.add(error.expected)

          errorCount++
        }
      })

      if (errorCount === types.length)
        throw new TypeParseError([...expectTypes].join('|'), input)

      return input as InferTuple<TTypes>
    },
  }
}

function enumType<
  TKey extends string,
  TValues extends [TKey, ...TKey[]],
  TUnion = TValues[number],
>(values: TValues): EnumType<FakeEnum<TValues>, TValues, TUnion>

function enumType<
  TKey extends string,
  TValues extends Readonly<[TKey, ...TKey[]]>,
  TUnion = TValues[number],
>(values: TValues): EnumType<FakeEnum<TValues>, TValues, TUnion>

function enumType<TValues extends EnumValues, TUnion = TValues[number]>(
  ...values: TValues
): EnumType<FakeEnum<TValues>, TValues, TUnion>

function enumType<
  Key extends string,
  Value extends EnumKey,
  TEnum extends Record<Key, Value>,
  TUnion = TEnum[keyof TEnum],
>(anEnum: TEnum): EnumType<Unwrap<TEnum>, TEnum, TUnion>

function enumType<
  TEnumOrFirstValue extends EnumOrFirstValue,
  TNextValues extends string[] | EnumValues,
>(
  enumOrFirstValue: TEnumOrFirstValue,
  ...nextValues: TNextValues
): EnumType<unknown, unknown, unknown> {
  let enumObj: EnumLike = {}
  let values: (string | number)[] = []

  if (typeof enumOrFirstValue === 'string') {
    values = [enumOrFirstValue, ...nextValues]
  }
  else if (Array.isArray(enumOrFirstValue)) {
    values = [...enumOrFirstValue, ...nextValues]
  }
  else if (typeof enumOrFirstValue === 'object') {
    enumObj = { ...enumOrFirstValue } as EnumLike
    Object.entries(enumObj).forEach(([, value]) => {
      if (typeof enumObj[value] !== 'number')
        values.push(value)
    })
  }

  if (values.length === 0)
    throw new TypeParseError('enum', enumOrFirstValue) // TODO better error

  if (Object.keys(enumObj).length === 0) {
    values.forEach((value) => {
      enumObj[value] = value
    })
  }

  const schema = unionType([stringType(), numberType()])

  return {
    enum: Object.freeze(enumObj),
    options: Object.freeze(values),
    parse(input: unknown) {
      const value = schema.parse(input)

      if (values.includes(value) === false)
        throw new TypeParseError(values.join('|'), input)

      return value
    },
  }
}

function nativeEnumType<
  Key extends string,
  Value extends EnumKey,
  TEnum extends Record<Key, Value>,
  TUnion = TEnum[keyof TEnum],
>(anEnum: TEnum): EnumType<Unwrap<TEnum>, TEnum, TUnion> {
  return enumType(anEnum)
}

export const tosi = {
  never: neverType,
  unknown: unknownType,
  any: unknownType,
  void: undefinedType,
  string: stringType,
  literal: literalType,
  number: numberType,
  boolean: booleanType,
  bigint: bigintType,
  symbol: symbolType,
  function: functionType,
  null: nullType,
  undefined: undefinedType,
  array: arrayType,
  tuple: tupleType,
  object: objectType,
  optional: optionalType,
  union: unionType,
  enum: enumType,
  nativeEnum: nativeEnumType,
}
